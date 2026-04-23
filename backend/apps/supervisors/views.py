from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.evaluations.models import WeeklyLog
from apps.students.models import InternshipPlacement
from apps.supervisors.models import Notification
from apps.users.models import User
from .permissions import IsSupervisor
from .serializers import (
    WeeklyLogSerializer,
    ReviewCreateSerializer,
    StatusUpdateSerializer,
    SupervisorStudentSerializer,
)


def _notify_student(student, message):
    """Helper: create an in-app notification for the student."""
    Notification.objects.create(user=student, message=message)


def _get_student_ids(user):
    """Return student IDs assigned to this supervisor."""
    if user.role == 'work_supervisor':
        return user.workplace_placements.values_list('student_id', flat=True)
    return user.academic_placements.values_list('student_id', flat=True)


class SupervisorStudentListView(APIView):
    """
    GET /api/supervisor/students/
    Returns all students assigned to the logged-in supervisor
    with their placement details and log summary.
    """
    permission_classes = [IsSupervisor]

    def get(self, request):
        student_ids = _get_student_ids(request.user)
        placements = InternshipPlacement.objects.filter(
            student_id__in=student_ids
        ).select_related('student', 'workplace_supervisor', 'academic_supervisor')

        data = SupervisorStudentSerializer(placements, many=True, context={'request': request}).data
        return Response(data)


class SupervisorLogListView(generics.ListAPIView):
    """
    GET /api/supervisor/logs/
    Returns all logs with status = submitted or reviewed,
    scoped to students assigned to this supervisor.
    """
    serializer_class = WeeklyLogSerializer
    permission_classes = [IsSupervisor]

    def get_queryset(self):
        return WeeklyLog.objects.filter(
            student_id__in=_get_student_ids(self.request.user),
            status__in=['submitted', 'reviewed'],
        ).select_related('student').prefetch_related('feedback')


class SupervisorLogDetailView(generics.RetrieveAPIView):
    """
    GET /api/supervisor/logs/<id>/
    Returns full details of a single log including all feedback.
    """
    serializer_class = WeeklyLogSerializer
    permission_classes = [IsSupervisor]

    def get_queryset(self):
        return WeeklyLog.objects.filter(student_id__in=_get_student_ids(self.request.user))


class SupervisorReviewCreateView(APIView):
    """
    POST /api/supervisor/review/<log_id>/
    Supervisor adds a feedback comment to a log.
    """
    permission_classes = [IsSupervisor]

    def post(self, request, log_id):
        try:
            log = WeeklyLog.objects.get(pk=log_id, student_id__in=_get_student_ids(request.user))
        except WeeklyLog.DoesNotExist:
            return Response({'detail': 'Log not found or not assigned to you.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ReviewCreateSerializer(data=request.data, context={'log': log, 'request': request})
        if serializer.is_valid():
            feedback = serializer.save()
            _notify_student(log.student, f"{request.user.get_full_name()} left feedback on your Week {log.week_number} log.")
            from .serializers import FeedbackSerializer
            return Response(FeedbackSerializer(feedback).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SupervisorStatusUpdateView(APIView):
    """
    PATCH /api/supervisor/logs/<id>/status/
    Supervisor changes log status with valid transition enforcement.
    """
    permission_classes = [IsSupervisor]

    def patch(self, request, pk):
        try:
            log = WeeklyLog.objects.get(pk=pk, student_id__in=_get_student_ids(request.user))
        except WeeklyLog.DoesNotExist:
            return Response({'detail': 'Log not found or not assigned to you.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = StatusUpdateSerializer(data=request.data, context={'log': log})
        if serializer.is_valid():
            new_status = serializer.validated_data['status']
            log.status = new_status
            if new_status == 'reviewed':
                log.reviewed_at = timezone.now()
            elif new_status == 'approved':
                log.approved_at = timezone.now()
            log.save()
            _notify_student(log.student, f"Your Week {log.week_number} log has been marked as '{new_status}' by {request.user.get_full_name()}.")
            return Response(WeeklyLogSerializer(log).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SupervisorStatsView(APIView):
    """
    GET /api/supervisor/stats/
    Returns summary counts for the supervisor dashboard.
    """
    permission_classes = [IsSupervisor]

    def get(self, request):
        student_ids = _get_student_ids(request.user)
        logs = WeeklyLog.objects.filter(student_id__in=student_ids)
        return Response({
            'total_students': len(set(student_ids)),
            'pending_review': logs.filter(status='submitted').count(),
            'reviewed': logs.filter(status='reviewed').count(),
            'approved': logs.filter(status='approved').count(),
        })
