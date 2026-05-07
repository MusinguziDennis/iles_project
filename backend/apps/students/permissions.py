from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrReadOnly(BasePermission):
    """
    Allow read access to authenticated users.
    Allow write access (POST/PUT/PATCH/DELETE) only to users with role 'admin'.
    """

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if request.method in SAFE_METHODS:
            return True
        # Allow if user explicitly has the 'admin' role or is a Django superuser
        return getattr(user, 'role', None) == 'admin' or getattr(user, 'is_superuser', False)
