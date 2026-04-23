from django.urls import path
from .views import (
    SupervisorStudentListView,
    SupervisorLogListView,
    SupervisorLogDetailView,
    SupervisorReviewCreateView,
    SupervisorStatusUpdateView,
    SupervisorStatsView,
)

urlpatterns = [
    path('stats/', SupervisorStatsView.as_view(), name='supervisor-stats'),
    path('students/', SupervisorStudentListView.as_view(), name='supervisor-students'),
    path('logs/', SupervisorLogListView.as_view(), name='supervisor-log-list'),
    path('logs/<int:pk>/', SupervisorLogDetailView.as_view(), name='supervisor-log-detail'),
    path('review/<int:log_id>/', SupervisorReviewCreateView.as_view(), name='supervisor-review-create'),
    path('logs/<int:pk>/status/', SupervisorStatusUpdateView.as_view(), name='supervisor-status-update'),
]
