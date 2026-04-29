from django.urls import path
from .views import MeView, RegisterView, UserListView, UserDetailView, AdminUserListView, AdminUserDetailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='user-register'),
    path('me/', MeView.as_view(), name='user-me'),
    path('list/', UserListView.as_view(), name='user-list'),
    path('<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('admin/', AdminUserListView.as_view(), name='admin-users'),
    path('admin/<int:pk>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
]
