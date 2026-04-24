from rest_framework import serializers
from apps.users.models import User
from .models import InternshipPlacement
from django.utils import timezone


class StudentUserSerializer(serializers.ModelSerializer):
    """
    Serializer for Student User objects (limited fields).
    Used as a nested serializer in InternshipPlacement serializers.
    """
    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'phone_number']
        read_only_fields = ['id', 'username', 'email', 'full_name']


class SupervisorUserSerializer(serializers.ModelSerializer):
    """
    Serializer for Supervisor User objects (university or work supervisors).
    Used as a nested serializer in InternshipPlacement serializers.
    """
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'phone_number', 'role', 'role_display']
        read_only_fields = ['id', 'username', 'email', 'full_name', 'role', 'role_display']


class InternshipPlacementListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for listing placements.
    Includes basic student info and supervisor names for overview.
    """
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    workplace_supervisor_name = serializers.CharField(
        source='workplace_supervisor.get_full_name',
        read_only=True,
        allow_null=True
    )
    academic_supervisor_name = serializers.CharField(
        source='academic_supervisor.get_full_name',
        read_only=True,
        allow_null=True
    )
    duration_days = serializers.SerializerMethodField()

    class Meta:
        model = InternshipPlacement
        fields = [
            'id', 'student_name', 'company_name', 'workplace_supervisor_name',
            'academic_supervisor_name', 'start_date', 'end_date', 'duration_days'
        ]
        read_only_fields = ['id', 'student_name', 'duration_days']

    def get_duration_days(self, obj):
        """Calculate the number of days in the internship."""
        return (obj.end_date - obj.start_date).days


class InternshipPlacementDetailedSerializer(serializers.ModelSerializer):
    """
    Full-details serializer for individual placement endpoints.
    Includes nested student and supervisor objects with all relevant info.
    """
    student = StudentUserSerializer(read_only=True)
    workplace_supervisor = SupervisorUserSerializer(read_only=True, allow_null=True)
    academic_supervisor = SupervisorUserSerializer(read_only=True, allow_null=True)
    duration_days = serializers.SerializerMethodField()
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = InternshipPlacement
        fields = [
            'id', 'student', 'company_name', 'workplace_supervisor',
            'academic_supervisor', 'start_date', 'end_date', 'duration_days',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'student', 'created_at', 'updated_at', 'duration_days', 'is_active']

    def get_duration_days(self, obj):
        """Calculate the number of days in the internship."""
        return (obj.end_date - obj.start_date).days

    def get_is_active(self, obj):
        """Check if the internship is currently active."""
        today = timezone.now().date()
        return obj.start_date <= today <= obj.end_date


class InternshipPlacementCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating placements.
    Includes validation logic for date ranges and supervisor role checks.
    """
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='student'),
        write_only=True,
        source='student'
    )
    workplace_supervisor_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='work_supervisor'),
        write_only=True,
        source='workplace_supervisor',
        required=False,
        allow_null=True
    )
    academic_supervisor_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='university_supervisor'),
        write_only=True,
        source='academic_supervisor',
        required=False,
        allow_null=True
    )
    # Read-only fields for response
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    workplace_supervisor_name = serializers.CharField(
        source='workplace_supervisor.get_full_name',
        read_only=True,
        allow_null=True
    )
    academic_supervisor_name = serializers.CharField(
        source='academic_supervisor.get_full_name',
        read_only=True,
        allow_null=True
    )

    class Meta:
        model = InternshipPlacement
        fields = [
            'id', 'student_id', 'student_name', 'company_name',
            'workplace_supervisor_id', 'workplace_supervisor_name',
            'academic_supervisor_id', 'academic_supervisor_name',
            'start_date', 'end_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'student_name', 'workplace_supervisor_name', 'academic_supervisor_name', 'created_at', 'updated_at']

    def validate(self, data):
        """Validate date range: end_date must be after start_date."""
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        if start_date and end_date:
            if end_date <= start_date:
                raise serializers.ValidationError(
                    "End date must be after start date."
                )

        return data

    def validate_student(self, value):
        """Ensure each student has only one active placement."""
        # Check if student already has a placement (for create operations)
        if self.instance is None:  # Create operation
            if InternshipPlacement.objects.filter(student=value).exists():
                raise serializers.ValidationError(
                    "This student already has an active placement."
                )
        return value