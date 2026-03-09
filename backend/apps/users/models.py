from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):

    ROLE_CHOICES = (
        ('student', 'Student'),
        ('university_supervisor', 'University Supervisor'),
        ('work_supervisor', 'Work Supervisor'),
        ('admin', 'Admin'),
    )

    role = models.CharField(max_length=30, choices=ROLE_CHOICES)

    phone_number = models.CharField(max_length=15, blank=True)
