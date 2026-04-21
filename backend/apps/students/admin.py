from django.contrib import admin
from .models import InternshipPlacement


@admin.register(InternshipPlacement)
class InternshipPlacementAdmin(admin.ModelAdmin):
    list_display = ('student', 'company_name', 'workplace_supervisor', 'academic_supervisor', 'start_date', 'end_date')
    list_filter = ('start_date', 'end_date')
    search_fields = ('student__username', 'company_name')
