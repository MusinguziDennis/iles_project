from django.urls import path
from .views import (
    SupervisorLogListView,
    SupervisorLogDetailView,
    SupervisorReviewCreateView,
    SupervisorStatusUpdateView,
    SupervisorStatsView,
)

urlpatterns = [
    # Dashboard stats
    path('stats/', SupervisorStatsView.as_view(), name='supervisor-stats'),

    # Log list & detail
    path('logs/', SupervisorLogListView.as_view(), name='supervisor-log-list'),
    path('logs/<int:pk>/', SupervisorLogDetailView.as_view(), name='supervisor-log-detail'),

    # Add review comment
    path('review/<int:log_id>/', SupervisorReviewCreateView.as_view(), name='supervisor-review-create'),

    # Update log status
    path('logs/<int:pk>/status/', SupervisorStatusUpdateView.as_view(), name='supervisor-status-update'),
]
