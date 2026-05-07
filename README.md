# ILES - Internship Log & Evaluation System

A full-stack web application for managing student internships, weekly logs, and supervisor evaluations.

## Tech Stack

### Backend
- Django 4.x + Django REST Framework
- JWT Authentication (Simple JWT)
- SQLite (development) / PostgreSQL (production ready)
- CORS enabled for frontend integration

### Frontend
- React 18 + Vite
- React Router v6
- Axios for API calls
- Inline CSS styling

## Features

- **User Management**: Students, Work Supervisors, Academic Supervisors, Admins
- **Placement Management**: Assign students to companies with supervisors
- **Weekly Logs**: Students submit weekly reports, supervisors review and approve
- **Notifications**: Real-time in-app notifications for log submissions and feedback
- **Role-based Access Control**: Each role sees only relevant data
- **Workflow Enforcement**: Draft → Submitted → Reviewed → Approved

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend runs on `http://localhost:8000`

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Default Roles

- `student`: Can create/submit weekly logs, view placement details
- `work_supervisor`: Can review logs from assigned students
- `university_supervisor`: Can review and approve logs
- `admin`: Full system access, user and placement management

## API Endpoints

- `/api/token/` - JWT login
- `/api/users/` - User management
- `/api/students/placements/` - Placement CRUD
- `/api/evaluations/logs/` - Weekly log CRUD
- `/api/supervisor/` - Supervisor-specific endpoints

## Environment Variables

Create `backend/.env`:

```
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
```

## License

MIT
