from django.db import models
from apps.users.models import User


class WeeklyLog(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
    ]

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='weekly_logs', limit_choices_to={'role': 'student'})
    week_number = models.PositiveIntegerField()
    content = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    submitted_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'week_number')
        ordering = ['week_number']

    def __str__(self):
        return f"{self.student.get_full_name()} — Week {self.week_number} [{self.status}]"


class Feedback(models.Model):
    weekly_log = models.ForeignKey(WeeklyLog, on_delete=models.CASCADE, related_name='feedback')
    supervisor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedback_given')
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback by {self.supervisor.get_full_name()} on Log #{self.weekly_log.id}"
