from django.urls import path
from .views import MeView, RegisterView, UserListView, UserDetailView, ChangePasswordView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='user-register'),
    path('me/', MeView.as_view(), name='user-me'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('list/', UserListView.as_view(), name='user-list'),
    path('<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]
