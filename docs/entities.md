# Identified Entities

## User
Represents any person who can log in to the system.

**Attributes**:
- `id` (Primary Key)
- `email` (unique)
- `password` (hashed)
- `first_name`
- `last_name`
- `role` (choices: `student`, `workplace_supervisor`, `academic_supervisor`, `administrator`)
- `is_active` (boolean)
- `date_joined`

## InternshipPlacement
Links a student to their internship details.

**Attributes**:
- `id` (Primary Key)
- `student` (One‑to‑One with User, role = `student`)
- `company_name` (string)
- `workplace_supervisor` (ForeignKey to User, role = `workplace_supervisor`)
- `academic_supervisor` (ForeignKey to User, role = `academic_supervisor`)
- `start_date` (date)
- `end_date` (date)
- `created_at`
- `updated_at`

## WeeklyLog
Records a student’s weekly entry.

**Attributes**:
- `id` (Primary Key)
- `student` (ForeignKey to User, role = `student`)
- `week_number` (integer, e.g., week 1, 2, …)
- `content` (text)
- `status` (choices: `draft`, `submitted`, `reviewed`, `approved`)
- `submitted_at` (timestamp, null until submitted)
- `reviewed_at` (timestamp, null until workplace supervisor reviews)
- `approved_at` (timestamp, null until academic supervisor approves)
- `created_at`
- `updated_at`

## Feedback
Represents comments from a supervisor on a weekly log. Each log can have multiple feedback entries (e.g., from workplace and academic supervisors, or multiple rounds).

**Attributes**:
- `id` (Primary Key)
- `weekly_log` (ForeignKey to WeeklyLog)
- `supervisor` (ForeignKey to User, role = `workplace_supervisor` or `academic_supervisor`)
- `comment` (text)
- `created_at`

## Notification
Represents system notifications for users.

**Attributes**:
- `id` (Primary Key)
- `user` (ForeignKey to User)
- `message` (text)
- `is_read` (boolean)
- `created_at`

## Relationships
- A **User** can 