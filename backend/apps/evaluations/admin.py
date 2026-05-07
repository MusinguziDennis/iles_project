from django.contrib import admin
from .models import WeeklyLog, Feedback


@admin.register(WeeklyLog)
class WeeklyLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'week_number', 'status', 'submitted_at', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('student__username', 'student__email', 'content')
    readonly_fields = ('created_at', 'updated_at', 'submitted_at', 'reviewed_at', 'approved_at')
    ordering = ('-created_at',)


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('id', 'weekly_log', 'supervisor', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('supervisor__username', 'comment')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
