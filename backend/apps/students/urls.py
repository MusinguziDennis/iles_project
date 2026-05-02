from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InternshipPlacementViewSet, StudentNotificationListView, StudentNotificationMarkReadView, StudentNotificationMarkAllReadView

router = DefaultRouter()
router.register(r'placements', InternshipPlacementViewSet, basename='placement')

urlpatterns = [
    path('', include(router.urls)),
    path('notifications/', StudentNotificationListView.as_view(), name='student-notifications'),
    path('notifications/<int:pk>/read/', StudentNotificationMarkReadView.as_view(), name='student-notification-read'),
    path('notifications/mark-all-read/', StudentNotificationMarkAllReadView.as_view(), name='student-notifications-mark-all'),
]