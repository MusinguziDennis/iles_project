from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import serializers

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


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ('id', 'message', 'is_read', 'created_at')


class SupervisorNotificationListView(generics.ListAPIView):
    """GET /api/supervisor/notifications/"""
    serializer_class = NotificationSerializer
    permission_classes = [IsSupervisor]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class SupervisorNotificationMarkReadView(APIView):
    """PATCH /api/supervisor/notifications/<id>/read/"""
    permission_classes = [IsSupervisor]

    def patch(self, request, pk):
        try:
            notif = Notification.objects.get(pk=pk, user=request.user)
            notif.is_read = True
            notif.save()
            return Response(NotificationSerializer(notif).data)
        except Notification.DoesNotExist:
            return Response({'detail': 'Notification not found.'}, status=status.HTTP_404_NOT_FOUND)


class SupervisorNotificationMarkAllReadView(APIView):
    """POST /api/supervisor/notifications/mark-all-read/"""
    permission_classes = [IsSupervisor]

    def post(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'detail': 'All notifications marked as read.'})


class SupervisorStudentListView(APIView):
    """GET /api/supervisor/students/"""
    permission_classes = [IsSupervisor]

    def get(self, request):
        student_ids = _get_student_ids(request.user)
        placements = InternshipPlacement.objects.filter(
            student_id__in=student_ids
        ).select_related('student', 'workplace_supervisor', 'academic_supervisor')
        data = SupervisorStudentSerializer(placements, many=True, context={'request': request}).data
        return Response(data)


class SupervisorLogListView(generics.ListAPIView):
    """GET /api/supervisor/logs/"""
    serializer_class = WeeklyLogSerializer
    permission_classes = [IsSupervisor]

    def get_queryset(self):
        return WeeklyLog.objects.filter(
            student_id__in=_get_student_ids(self.request.user),
            status__in=['submitted', 'reviewed'],
        ).select_related('student').prefetch_related('feedback')


class SupervisorLogDetailView(generics.RetrieveAPIView):
    """GET /api/supervisor/logs/<id>/"""
    serializer_class = WeeklyLogSerializer
    permission_classes = [IsSupervisor]

    def get_queryset(self):
        return WeeklyLog.objects.filter(student_id__in=_get_student_ids(self.request.user))


class SupervisorReviewCreateView(APIView):
    """POST /api/supervisor/review/<log_id>/"""
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
    """PATCH /api/supervisor/logs/<id>/status/"""
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
    """GET /api/supervisor/stats/"""
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
