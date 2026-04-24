from rest_framework.permissions import BasePermission


class IsSupervisor(BasePermission):
    """Allow access only to users with a supervisor role."""

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in ('work_supervisor', 'university_supervisor')
        )
