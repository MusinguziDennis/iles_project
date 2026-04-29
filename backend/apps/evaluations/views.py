from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import WeeklyLog, Feedback
from .serializers import (
    WeeklyLogListSerializer,
    WeeklyLogDetailedSerializer,
    WeeklyLogCreateUpdateSerializer,
    WeeklyLogStatusUpdateSerializer,
    FeedbackSerializer,
    FeedbackListSerializer,
)
from .permissions import IsAuthorizedSupervisor

class WeeklyLogViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing weekly logs.
    
    Provides full CRUD operations:
    - GET /api/evaluations/logs/ — List logs
    - POST /api/evaluations/logs/ — Create a new log
    - GET /api/evaluations/logs/{id}/ — Retrieve log details
    - PUT /api/evaluations/logs/{id}/ — Update log
    - PATCH /api/evaluations/logs/{id}/ — Partial update
    - DELETE /api/evaluations/logs/{id}/ — Delete log
    
    Custom actions:
    - PATCH /api/evaluations/logs/{id}/update_status/ — Update log status
    - GET /api/evaluations/logs/by-week/{week_number}/ — Get logs by week
    - GET /api/evaluations/logs/pending-review/ — Get logs pending review
    """
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        """
        Use different serializers based on action:
        - list: lightweight list serializer
        - retrieve: detailed serializer with feedback
        - create/update/partial_update: create/update serializer with validation
        - update_status: status-only serializer
        """
        if self.action == 'list':
            return WeeklyLogListSerializer
        elif self.action == 'retrieve':
            return WeeklyLogDetailedSerializer
        elif self.action == 'update_status':
            return WeeklyLogStatusUpdateSerializer
        return WeeklyLogCreateUpdateSerializer

    def get_queryset(self):
        """
        Filter logs based on user role:
        - Students: only their own logs
        - Supervisors: logs of their assigned students
        - Admins: all logs
        """
        user = self.request.user
        queryset = WeeklyLog.objects.select_related('student').prefetch_related('feedback__supervisor')

        if user.role == 'student':
            queryset = queryset.filter(student=user)
        elif user.role in ['work_supervisor', 'university_supervisor']:
            # Get student IDs assigned to this supervisor
            if user.role == 'work_supervisor':
                student_ids = user.workplace_placements.values_list('student_id', flat=True)
            else:
                student_ids = user.academic_placements.values_list('student_id', flat=True)
            queryset = queryset.filter(student_id__in=student_ids)

        return queryset

    def perform_create(self, serializer):
        """Create log with student context."""
        serializer.save()

    def perform_update(self, serializer):
        """Update log."""
        serializer.save()

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """
        Custom action: PATCH /api/evaluations/logs/{id}/update_status/
        Updates only the status and sets appropriate timestamps.
        """
        log = self.get_object()
        serializer = WeeklyLogStatusUpdateSerializer(log, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def pending_review(self, request):
        """
        Custom action: GET /api/evaluations/logs/pending_review/
        Returns logs that are submitted but not yet reviewed/approved.
        """
        queryset = self.get_queryset().filter(status='submitted')
        serializer = WeeklyLogListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_week(self, request):
        """
        Custom action: GET /api/evaluations/logs/by_week/?week_number=5
        Returns logs for a specific week.
        """
        week_number = request.query_params.get('week_number')
        if not week_number:
            return Response(
                {'detail': 'week_number query parameter is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            week_number = int(week_number)
        except ValueError:
            return Response(
                {'detail': 'week_number must be an integer.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        queryset = self.get_queryset().filter(week_number=week_number)
        serializer = WeeklyLogListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def feedback(self, request, pk=None):
        """
        Custom action: GET /api/evaluations/logs/{id}/feedback/
        Returns all feedback for a specific log.
        """
        log = self.get_object()
        feedback_items = log.feedback.all()
        serializer = FeedbackListSerializer(feedback_items, many=True)
        return Response(serializer.data)


class FeedbackViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing feedback on logs.
    
    Provides CRUD operations:
    - GET /api/evaluations/feedback/ — List feedback
    - POST /api/evaluations/feedback/ — Create feedback
    - GET /api/evaluations/feedback/{id}/ — Retrieve feedback
    - PUT /api/evaluations/feedback/{id}/ — Update feedback
    - PATCH /api/evaluations/feedback/{id}/ — Partial update
    - DELETE /api/evaluations/feedback/{id}/ — Delete feedback
    
    Restrictions:
    - Only supervisors can create feedback
    - Only supervisors (who created the feedback or are admins) can update/delete
    """
    permission_classes = [IsAuthenticated, IsAuthorizedSupervisor]  # Add permission
    serializer_class = FeedbackSerializer

    def get_queryset(self):
        """
        Filter feedback based on user role:
        - Supervisors: feedback they gave or feedback on their assigned students' logs
        - Admins: all feedback
        """
        user = self.request.user
        queryset = Feedback.objects.select_related('weekly_log__student', 'supervisor')

        if user.role in ['work_supervisor', 'university_supervisor']:
            # Get student IDs assigned to this supervisor
            if user.role == 'work_supervisor':
                student_ids = user.workplace_placements.values_list('student_id', flat=True)
            else:
                student_ids = user.academic_placements.values_list('student_id', flat=True)
            # Show feedback on their students' logs or feedback they created
            queryset = queryset.filter(
                weekly_log__student_id__in=student_ids
            )

        return queryset

    def get_serializer_class(self):
        """Use list serializer for list action."""
        if self.action == 'list':
            return FeedbackListSerializer
        return FeedbackSerializer

    def perform_create(self, serializer):
        """Set the supervisor as the current user when creating feedback."""
        # Verify user is a supervisor
        if self.request.user.role not in ['work_supervisor', 'university_supervisor']:
            raise PermissionError("Only supervisors can create feedback.")
        serializer.save(supervisor=self.request.user)

    def perform_update(self, serializer):
        """Allow update only if user is the feedback creator or admin."""
        feedback = self.get_object()
        if self.request.user != feedback.supervisor and self.request.user.role != 'admin':
            raise PermissionError("You can only update your own feedback.")
        serializer.save()

    def perform_destroy(self, instance):
        """Allow delete only if user is the feedback creator or admin."""
        if self.request.user != instance.supervisor and self.request.user.role != 'admin':
            raise PermissionError("You can only delete your own feedback.")
        instance.delete()


class StudentLogListView(generics.ListCreateAPIView):
    """
    Alternative simple view for students to list and create their logs.
    
    GET /api/evaluations/logs/student/ — List student's logs
    POST /api/evaluations/logs/student/ — Create a log
    """
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        """Use create/update serializer for POST."""
        if self.request.method == 'POST':
            return WeeklyLogCreateUpdateSerializer
        return WeeklyLogListSerializer

    def get_queryset(self):
        """Students only see their own logs."""
        return WeeklyLog.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        """Force the student to be the current user."""
        serializer.save(student=self.request.user)


class SupervisorLogReviewView(generics.ListAPIView):
    """
    View for supervisors to see logs requiring review.
    
    GET /api/evaluations/logs/review/ — List logs submitted for review
    """
    permission_classes = [IsAuthenticated]
    serializer_class = WeeklyLogDetailedSerializer

    def get_queryset(self):
        """Get submitted logs for assigned students."""
        user = self.request.user
        
        if user.role == 'work_supervisor':
            student_ids = user.workplace_placements.values_list('student_id', flat=True)
        elif user.role == 'university_supervisor':
            student_ids = user.academic_placements.values_list('student_id', flat=True)
        else:
            student_ids = []

        return WeeklyLog.objects.filter(
            student_id__in=student_ids,
            status__in=['submitted', 'reviewed']
        ).select_related('student').prefetch_related('feedback')


class LogStatisticsView(generics.GenericAPIView):
    """
    View for retrieving log statistics.
    
    GET /api/evaluations/logs/stats/ — Get statistics on logs
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Return statistics on logs for the user."""
        user = request.user

        if user.role == 'student':
            logs = WeeklyLog.objects.filter(student=user)
            stats = {
                'total_logs': logs.count(),
                'draft': logs.filter(status='draft').count(),
                'submitted': logs.filter(status='submitted').count(),
                'reviewed': logs.filter(status='reviewed').count(),
                'approved': logs.filter(status='approved').count(),
                'pending_feedback': logs.filter(status='submitted').count(),
            }
        elif user.role in ['work_supervisor', 'university_supervisor']:
            if user.role == 'work_supervisor':
                student_ids = user.workplace_placements.values_list('student_id', flat=True)
            else:
                student_ids = user.academic_placements.values_list('student_id', flat=True)

            logs = WeeklyLog.objects.filter(student_id__in=student_ids)
            stats = {
                'total_logs_supervised': logs.count(),
                'submitted': logs.filter(status='submitted').count(),
                'reviewed': logs.filter(status='reviewed').count(),
                'approved': logs.filter(status='approved').count(),
                'students_supervised': len(set(logs.values_list('student_id', flat=True))),
            }
        else:  # Admin
            logs = WeeklyLog.objects.all()
            stats = {
                'total_logs': logs.count(),
                'draft': logs.filter(status='draft').count(),
                'submitted': logs.filter(status='submitted').count(),
                'reviewed': logs.filter(status='reviewed').count(),
                'approved': logs.filter(status='approved').count(),
                'total_feedback': Feedback.objects.count(),
            }

        return Response(stats)