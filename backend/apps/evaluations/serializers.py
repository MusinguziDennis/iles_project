from rest_framework import serializers
from django.utils import timezone
from apps.users.models import User
from .models import WeeklyLog, Feedback


class SupervisorFeedbackSerializer(serializers.ModelSerializer):
    """
    Serializer for Supervisor objects in feedback context.
    Used as nested serializer within Feedback serializers.
    """
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'phone_number', 'role', 'role_display']
        read_only_fields = ['id', 'username', 'email', 'full_name', 'role', 'role_display']


class StudentLogSerializer(serializers.ModelSerializer):
    """
    Serializer for Student User in WeeklyLog context.
    Used as nested serializer within WeeklyLog serializers.
    """
    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'phone_number']
        read_only_fields = ['id', 'username', 'email', 'full_name']


class FeedbackSerializer(serializers.ModelSerializer):
    """
    Serializer for Feedback objects.
    Includes supervisor details and timestamps.
    Used as nested serializer in detailed WeeklyLog responses.
    """
    supervisor = SupervisorFeedbackSerializer(read_only=True)
    supervisor_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role__in=['university_supervisor', 'work_supervisor']),
        write_only=True,
        source='supervisor'
    )

    class Meta:
        model = Feedback
        fields = ['id', 'supervisor', 'supervisor_id', 'comment', 'created_at']
        read_only_fields = ['id', 'supervisor', 'created_at']

    def validate_comment(self, value):
        """Ensure feedback comment is not empty."""
        if not value or not value.strip():
            raise serializers.ValidationError("Feedback comment cannot be empty.")
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Feedback comment must be at least 5 characters.")
        return value.strip()


class FeedbackListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for listing feedback.
    Shows supervisor name as string instead of nested object.
    """
    supervisor_name = serializers.CharField(source='supervisor.get_full_name', read_only=True)

    class Meta:
        model = Feedback
        fields = ['id', 'supervisor_name', 'comment', 'created_at']
        read_only_fields = ['id', 'supervisor_name', 'created_at']


class WeeklyLogListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for listing logs (overview).
    Used for list endpoints and dashboard views.
    Shows basic info without nested objects.
    """
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    feedback_count = serializers.SerializerMethodField()
    days_since_submission = serializers.SerializerMethodField()

    class Meta:
        model = WeeklyLog
        fields = [
            'id', 'student_name', 'week_number', 'status', 'status_display',
            'submitted_at', 'reviewed_at', 'approved_at', 'feedback_count',
            'days_since_submission', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'student_name', 'status_display', 'feedback_count',
            'days_since_submission', 'created_at', 'updated_at'
        ]

    def get_feedback_count(self, obj):
        """Return the count of feedback items for this log."""
        return obj.feedback.count()

    def get_days_since_submission(self, obj):
        """Calculate days since submission (if submitted)."""
        if obj.submitted_at:
            delta = timezone.now() - obj.submitted_at
            return delta.days
        return None


class WeeklyLogDetailedSerializer(serializers.ModelSerializer):
    """
    Full-details serializer for individual log endpoints.
    Includes nested student object and all feedback with supervisor info.
    """
    student = StudentLogSerializer(read_only=True)
    feedback = FeedbackListSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    feedback_count = serializers.SerializerMethodField()

    class Meta:
        model = WeeklyLog
        fields = [
            'id', 'student', 'week_number', 'content', 'status', 'status_display',
            'submitted_at', 'reviewed_at', 'approved_at', 'feedback', 'feedback_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'student', 'status_display', 'feedback', 'feedback_count',
            'created_at', 'updated_at'
        ]

    def get_feedback_count(self, obj):
        """Return the count of feedback items."""
        return obj.feedback.count()


class WeeklyLogCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating logs.
    Includes validation for student role and status transitions.
    """
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='student'),
        write_only=True,
        source='student'
    )
    # Read-only response fields
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = WeeklyLog
        fields = [
            'id', 'student_id', 'student_name', 'week_number', 'content', 'status',
            'status_display', 'submitted_at', 'reviewed_at', 'approved_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'student_name', 'status_display', 'submitted_at', 'reviewed_at',
            'approved_at', 'created_at', 'updated_at'
        ]

    def validate_week_number(self, value):
        """Ensure week number is positive and reasonable."""
        if value < 1:
            raise serializers.ValidationError("Week number must be at least 1.")
        if value > 52:
            raise serializers.ValidationError("Week number cannot exceed 52.")
        return value

    def validate_content(self, value):
        """Ensure content is not empty."""
        if not value or not value.strip():
            raise serializers.ValidationError("Log content cannot be empty.")
        if len(value.strip()) < 20:
            raise serializers.ValidationError("Log content must be at least 20 characters.")
        return value

    def validate(self, data):
        """
        Validate:
        - Unique constraint: student + week_number (for create)
        - Content + week_number are provided
        """
        student = data.get('student')
        week_number = data.get('week_number')

        # Check unique constraint for create operations
        if self.instance is None and student and week_number:
            if WeeklyLog.objects.filter(student=student, week_number=week_number).exists():
                raise serializers.ValidationError(
                    f"A log for {student.get_full_name()} in week {week_number} already exists."
                )

        return data


class WeeklyLogStatusUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for status updates only (submitted, reviewed, approved).
    Automatically sets timestamps based on status transitions.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = WeeklyLog
        fields = ['id', 'status', 'status_display', 'submitted_at', 'reviewed_at', 'approved_at']
        read_only_fields = ['id', 'status_display', 'submitted_at', 'reviewed_at', 'approved_at']

    def validate_status(self, value):
        """Ensure status is valid and approved logs cannot be re-submitted."""
        valid_statuses = ['draft', 'submitted', 'reviewed', 'approved']
        if value not in valid_statuses:
            raise serializers.ValidationError(
                f"Invalid status. Choose from: {', '.join(valid_statuses)}"
            )
        if self.instance and self.instance.status == 'approved':
            raise serializers.ValidationError('Cannot change status of an approved log.')
        return value

    def update(self, instance, validated_data):
        """
        Update status and set appropriate timestamps.
        - 'submitted' → sets submitted_at
        - 'reviewed' → sets reviewed_at
        - 'approved' → sets approved_at
        """
        new_status = validated_data.get('status', instance.status)

        if new_status == 'submitted' and instance.status in ['draft']:
            instance.submitted_at = timezone.now()
        elif new_status == 'reviewed' and instance.status in ['submitted']:
            instance.reviewed_at = timezone.now()
        elif new_status == 'approved' and instance.status in ['reviewed']:
            instance.approved_at = timezone.now()

        instance.status = new_status
        instance.save()
        return instance