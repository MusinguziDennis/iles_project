from django.urls import path
from . import views

urlpatterns = [
    path('', views.evaluations_home, name='evaluations_home'),
]