from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string


def send_credentials_email(user, plain_password):
    """
    Send login credentials to a newly created user.
    Called when admin creates a user account.
    """
    role_display = {
        'student': 'Student Intern',
        'work_supervisor': 'Workplace Supervisor',
        'university_supervisor': 'Academic Supervisor',
        'admin': 'Administrator',
    }.get(user.role, user.role)

    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')

    subject = 'Your ILES Account Has Been Created'

    message = f"""
Hello {user.get_full_name() or user.username},

Your account on the Internship Logbook & Evaluation System (ILES) has been created.

Here are your login credentials:

  Username:  {user.username}
  Password:  {plain_password}
  Role:      {role_display}
  Email:     {user.email}

Login here: {frontend_url}/login

For security, please change your password after your first login.

If you did not expect this email, please contact your administrator.

Best regards,
ILES System
"""

    try:
        send_mail(
            subject=subject,
            message=message.strip(),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        # Log the error but don't crash the user creation
        print(f"[EMAIL ERROR] Failed to send credentials to {user.email}: {e}")
        return False
