from rest_framework import serializers
from apps.evaluations.models import WeeklyLog, Feedback
from apps.users.models import User


class StudentSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'full_name', 'email')

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username


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


class ReviewCreateSerializer(serializers.ModelSerializer):
    """Used when a supervisor submits a review comment."""

    class Meta:
        model = Feedback
        fields = ('comment',)

    def validate(self, attrs):
        log = self.context['log']
        # Cannot review a draft log
        if log.status == 'draft':
            raise serializers.ValidationError('Cannot review a log that has not been submitted yet.')
        # Cannot add feedback to an already approved log
        if log.status == 'approved':
            raise serializers.ValidationError('This log is already approved and locked.')
        return attrs

    def create(self, validated_data):
        return Feedback.objects.create(
            weekly_log=self.context['log'],
            supervisor=self.context['request'].user,
            **validated_data,
        )


class StatusUpdateSerializer(serializers.Serializer):
    """Used when a supervisor changes the log status."""

    VALID_TRANSITIONS = {
        'submitted': ['reviewed'],
        'reviewed': ['approved', 'submitted'],  # can push back to submitted
    }

    status = serializers.ChoiceField(choices=['reviewed', 'approved', 'submitted'])

    def validate_status(self, new_status):
        log = self.context['log']
        allowed = self.VALID_TRANSITIONS.get(log.status, [])
        if new_status not in allowed:
            raise serializers.ValidationError(
                f"Cannot transition from '{log.status}' to '{new_status}'. "
                f"Allowed transitions: {allowed}"
            )
        return new_status
