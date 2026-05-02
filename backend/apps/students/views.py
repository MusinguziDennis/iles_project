from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .models import InternshipPlacement
from apps.supervisors.models import Notification
from .serializers import (
    InternshipPlacementListSerializer,
    InternshipPlacementDetailedSerializer,
    InternshipPlacementCreateUpdateSerializer,
)
from apps.supervisors.views import NotificationSerializer


class InternshipPlacementViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing internship placements.
    
    Provides full CRUD operations:
    - GET /api/students/placements/ — List all placements
    - POST /api/students/placements/ — Create a new placement
    - GET /api/students/placements/{id}/ — Retrieve placement details
    - PUT /api/students/placements/{id}/ — Update placement
    - PATCH /api/students/placements/{id}/ — Partial update
    - DELETE /api/students/placements/{id}/ — Delete placement
    
    Custom actions:
    - GET /api/students/placements/{id}/students/ — Get student details
    """
    queryset = InternshipPlacement.objects.select_related(
        'student', 'workplace_supervisor', 'academic_supervisor'
    )
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        """
        Use different serializers based on action:
        - list: lightweight list serializer
        - retrieve: detailed serializer with nested objects
        - create/update/partial_update: create/update serializer with validation
        """
        if self.action == 'list':
            return InternshipPlacementListSerializer
        elif self.action == 'retrieve':
            return InternshipPlacementDetailedSerializer
        return InternshipPlacementCreateUpdateSerializer

    def get_queryset(self):
        """
        Filter placements based on user role:
        - Students: only their own placement
        - Supervisors: their assigned students' placements
        - Admins: all placements
        """
        user = self.request.user
        queryset = self.queryset

        if user.role == 'student':
            queryset = queryset.filter(student=user)
        elif user.role in ['work_supervisor', 'university_supervisor']:
            # Supervisors see placements of their assigned students
            if user.role == 'work_supervisor':
                queryset = queryset.filter(workplace_supervisor=user)
            else:
                queryset = queryset.filter(academic_supervisor=user)

        return queryset

    def perform_create(self, serializer):
        """
        Override create to add any custom logic.
        The serializer already handles validation of student/supervisor roles.
        """
        serializer.save()

    def perform_update(self, serializer):
        """Override update to add custom logic if needed."""
        serializer.save()

    @action(detail=True, methods=['get'])
    def student_details(self, request, pk=None):
        """
        Custom action: GET /api/students/placements/{id}/student_details/
        Returns detailed student information for the placement.
        """
        placement = self.get_object()
        from apps.users.models import User
        user_serializer = InternshipPlacementDetailedSerializer(placement)
        return Response({
            'student': user_serializer.data['student']
        })

    @action(detail=True, methods=['get'])
    def supervisors(self, request, pk=None):
        """
        Custom action: GET /api/students/placements/{id}/supervisors/
        Returns both workplace and academic supervisors.
        """
        placement = self.get_object()
        return Response({
            'workplace_supervisor': {
                'id': placement.workplace_supervisor.id if placement.workplace_supervisor else None,
                'name': placement.workplace_supervisor.get_full_name() if placement.workplace_supervisor else None,
                'email': placement.workplace_supervisor.email if placement.workplace_supervisor else None,
            },
            'academic_supervisor': {
                'id': placement.academic_supervisor.id if placement.academic_supervisor else None,
                'name': placement.academic_supervisor.get_full_name() if placement.academic_supervisor else None,
                'email': placement.academic_supervisor.email if placement.academic_supervisor else None,
            }
        })


class StudentPlacementListCreateView(generics.ListCreateAPIView):
    """
    Alternative simple view for listing and creating placements.
    
    GET /api/students/placements/list/ — List placements (using ListSerializer)
    POST /api/students/placements/list/ — Create a placement
    """
    permission_classes = [IsAuthenticated]
    serializer_class = InternshipPlacementListSerializer

    def get_queryset(self):
        """Filter based on user role (same logic as ViewSet)."""
        user = self.request.user
        queryset = InternshipPlacement.objects.select_related(
            'student', 'workplace_supervisor', 'academic_supervisor'
        )

        if user.role == 'student':
            queryset = queryset.filter(student=user)
        elif user.role in ['work_supervisor', 'university_supervisor']:
            if user.role == 'work_supervisor':
                queryset = queryset.filter(workplace_supervisor=user)
            else:
                queryset = queryset.filter(academic_supervisor=user)

        return queryset

    def get_serializer_class(self):
        """Use create/update serializer for POST requests."""
        if self.request.method == 'POST':
            return InternshipPlacementCreateUpdateSerializer
        return InternshipPlacementListSerializer


class StudentPlacementDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Alternative simple view for retrieving, updating, and deleting placements.
    
    GET /api/students/placements/{id}/detail/ — Retrieve placement (detailed)
    PUT /api/students/placements/{id}/detail/ — Update placement
    PATCH /api/students/placements/{id}/detail/ — Partial update
    DELETE /api/students/placements/{id}/detail/ — Delete placement
    """
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_serializer_class(self):
        """Use detailed serializer for GET, create/update for PUT/PATCH."""
        if self.request.method in ['PUT', 'PATCH']:
            return InternshipPlacementCreateUpdateSerializer
        return InternshipPlacementDetailedSerializer
    
    def get_queryset(self):
        """Filter based on user role."""
        user = self.request.user
        queryset = InternshipPlacement.objects.select_related(
            'student', 'workplace_supervisor', 'academic_supervisor'
        )
        if user.role == 'student':
            return queryset.filter(student=user)
        elif user.role in ['work_supervisor', 'university_supervisor']:
            if user.role == 'work_supervisor':
                return queryset.filter(workplace_supervisor=user)
            else:
                return queryset.filter(academic_supervisor=user)
        return queryset


class StudentNotificationListView(generics.ListAPIView):
    """GET /api/students/notifications/"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class StudentNotificationMarkReadView(APIView):
    """PATCH /api/students/notifications/<id>/read/"""
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            notif = Notification.objects.get(pk=pk, user=request.user)
            notif.is_read = True
            notif.save()
            return Response(NotificationSerializer(notif).data)
        except Notification.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)


class StudentNotificationMarkAllReadView(APIView):
    """POST /api/students/notifications/mark-all-read/"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'detail': 'All notifications marked as read.'})
