from rest_framework import serializers
from apps.evaluations.models import WeeklyLog, Feedback
from apps.students.models import InternshipPlacement
from apps.users.models import User


class StudentSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    company_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'full_name', 'email', 'company_name')

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username

    def get_company_name(self, obj):
        placement = getattr(obj, 'placement', None)
        return placement.company_name if placement else 'N/A'


class FeedbackSerializer(serializers.ModelSerializer):
    supervisor_name = serializers.SerializerMethodField()

    class Meta:
        model = Feedback
        fields = ('id', 'supervisor', 'supervisor_name', 'comment', 'created_at')
        read_only_fields = ('id', 'supervisor', 'supervisor_name', 'created_at')

    def get_supervisor_name(self, obj):
        return obj.supervisor.get_full_name() or obj.supervisor.username


class WeeklyLogSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    feedback = FeedbackSerializer(many=True, read_only=True)

    class Meta:
        model = WeeklyLog
        fields = (
            'id', 'student', 'week_number', 'content',
            'status', 'submitted_at', 'reviewed_at', 'approved_at',
            'created_at', 'updated_at', 'feedback',
        )
        read_only_fields = fields


class SupervisorStudentSerializer(serializers.ModelSerializer):
    """Serializes a placement with student info and log summary."""
    student_name = serializers.SerializerMethodField()
    student_email = serializers.SerializerMethodField()
    student_id = serializers.SerializerMethodField()
    total_logs = serializers.SerializerMethodField()
    pending_logs = serializers.SerializerMethodField()
    approved_logs = serializers.SerializerMethodField()

    class Meta:
        model = InternshipPlacement
        fields = (
            'id', 'student_id', 'student_name', 'student_email',
            'company_name', 'start_date', 'end_date',
            'total_logs', 'pending_logs', 'approved_logs',
        )

    def get_student_name(self, obj):
        return obj.student.get_full_name() or obj.student.username

    def get_student_email(self, obj):
        return obj.student.email

    def get_student_id(self, obj):
        return obj.student.id

    def get_total_logs(self, obj):
        return obj.student.weekly_logs.count()

    def get_pending_logs(self, obj):
        return obj.student.weekly_logs.filter(status='submitted').count()

    def get_approved_logs(self, obj):
        return obj.student.weekly_logs.filter(status='approved').count()


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ('comment',)

    def validate(self, attrs):
        log = self.context['log']
        if log.status == 'draft':
            raise serializers.ValidationError('Cannot review a log that has not been submitted yet.')
        if log.status == 'approved':
            raise serializers.ValidationError('This log is already approved and locked.')
        comment = attrs.get('comment', '')
        if not comment or not comment.strip():
            raise serializers.ValidationError('Feedback comment cannot be empty.')
        return attrs

    def create(self, validated_data):
        return Feedback.objects.create(
            weekly_log=self.context['log'],
            supervisor=self.context['request'].user,
            **validated_data,
        )


class StatusUpdateSerializer(serializers.Serializer):
    VALID_TRANSITIONS = {
        'work_supervisor': {
            'submitted': ['reviewed'],
            'reviewed': ['submitted'],
        },
        'university_supervisor': {
            'submitted': ['reviewed'],
            'reviewed': ['approved', 'submitted'],
        },
    }

    status = serializers.ChoiceField(choices=['reviewed', 'approved', 'submitted'])

    def validate_status(self, new_status):
        log = self.context['log']
        user = self.context['request'].user
        role_transitions = self.VALID_TRANSITIONS.get(user.role, {})
        allowed = role_transitions.get(log.status, [])
        if new_status not in allowed:
            raise serializers.ValidationError(
                f"Cannot transition from '{log.status}' to '{new_status}'. Allowed: {allowed}"
            )
        return new_status
