from rest_framework.permissions import BasePermission


class IsAuthorizedSupervisor(BasePermission):
    """
    Allow only supervisors assigned to a student to provide feedback on their logs.
    Checks that the current user is the assigned supervisor for the log's student.
    """

    def has_object_permission(self, request, view, obj):
        """
        Check if the user is an authorized supervisor for this feedback object.
        
        obj: Feedback object
        """
        user = request.user
        
        # Only supervisors can create feedback
        if user.role not in ['work_supervisor', 'university_supervisor']:
            return False
        
        # Get the weekly log from the feedback object
        log = obj.weekly_log
        
        # Check if user is the assigned supervisor for this student
        if user.role == 'work_supervisor':
            return log.student.placement.workplace_supervisor == user
        else:  # university_supervisor
            return log.student.placement.academic_supervisor == user