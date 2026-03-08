from django.urls import path
from . import views

urlpatterns = [
    path('', views.supervisors_home, name='supervisors_home'),
]