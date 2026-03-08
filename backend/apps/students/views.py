from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.


def students_home(request):
    return HttpResponse("Students module working")