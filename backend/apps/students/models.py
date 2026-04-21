from django.db import models
from apps.users.models import User


class InternshipPlacement(models.Model):
    student = models.OneToOneField(User, on_delete=models.CASCADE, related_name='placement', limit_choices_to={'role': 'student'})
    company_name = models.CharField(max_length=255)
    workplace_supervisor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='workplace_placements', limit_choices_to={'role': 'work_supervisor'})
    academic_supervisor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='academic_placements', limit_choices_to={'role': 'university_supervisor'})
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.get_full_name()} — {self.company_name}"
