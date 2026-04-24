from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    WeeklyLogViewSet,
    FeedbackViewSet,
    StudentLogListView,
    SupervisorLogReviewView,
    LogStatisticsView,
)

router = DefaultRouter()
router.register(r'logs', WeeklyLogViewSet, basename='log')
router.register(r'feedback', FeedbackViewSet, basename='feedback')

urlpatterns = [
    path('', include(router.urls)),
    path('student-logs/', StudentLogListView.as_view(), name='student-logs'),
    path('review/', SupervisorLogReviewView.as_view(), name='review-logs'),
    path('stats/', LogStatisticsView.as_view(), name='log-stats'),
]