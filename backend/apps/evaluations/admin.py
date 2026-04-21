from django.contrib import admin
from .models import WeeklyLog, Feedback


@admin.register(WeeklyLog)
class WeeklyLogAdmin(admin.ModelAdmin):
    list_display = ('student', 'week_number', 'status', 'submitted_at', 'reviewed_at', 'approved_at')
    list_filter = ('status',)
    search_fields = ('student__username',)


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('weekly_log', 'supervisor', 'created_at')
    search_fields = ('supervisor__username',)
