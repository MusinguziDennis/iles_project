# Functional Requirements
## 1. User Management
- The system shall allow users to register with the role of **Student**, **Workplace Supervisor**, **Academic Supervisor**, or **Administrator**.
- The system shall authenticate users using email/username and a password.
- Users shall only be able to access functionality relevant to their role.
- Administrators shall be able to create, edit, deactivate, and delete user accounts.
- Administrators shall be able to reset user passwords.

## 2. Internship Placement
- Administrators shall be able to create, read, update, and delete placement records.
- Each placement shall link a **Student** to:
  - A **company name**
  - A **Workplace Supervisor** (user in the system)
  - An **Academic Supervisor** (user in the system)
  - Start date and end date of the internship
- Students shall be able to view only their own placement details.
- Supervisors (both workplace and academic) shall be able to view the list of students assigned to them.

## 3. Weekly Log Management
- Students shall be able to create, read, update, and delete **draft** logs.
- Students shall be able to submit a log for review, which changes its status from “draft” to “submitted”.
- Once submitted, a log becomes visible to both the Workplace Supervisor and the Academic Supervisor.
- Workplace Supervisors shall be able to:
  - View submitted logs for their assigned students.
  - Change the log status to “reviewed” (indicating they have read it).
  - Provide written feedback.
  - Request changes by changing the status back to “submitted” with comments.
  - Approve the log from the workplace side.
- Academic Supervisors shall be able to:
  - View submitted logs for their assigned students, including the workplace supervisor’s feedback and status.
  - Add their own feedback.
  - Mark the log as “approved” after confirming both workplace and academic requirements are met.
- Approved logs shall be locked and cannot be edited or deleted.

## 4. Workflow & State Transitions
- The system shall enforce valid status transitions as defined in `workflow.md`.
- The workflow states are: **Draft**, **Submitted**, **Reviewed**, **Approved**.
- Students can only edit logs in **Draft** or **Submitted** (if changes are requested).
- Supervisors cannot edit the content of a log, only add feedback and change status.

## 5. Notifications
- The system shall notify supervisors when a student submits a new log.
- The system shall notify students when a supervisor adds feedback or changes the log status.

## 6. Reporting
- Administrators shall be able to generate reports showing:
  - Number of logs submitted per student
  - Logs pending review for each supervisor
  - Approval rates by supervisor
- Academic Supervisors shall be able to generate a final summary report for each student at the end of the internship.

## 7. Log History & Audit
- The system shall maintain a history of status changes and feedback entries for each log.
- Users shall be able to view the full history of a log.

## 8. Security & Access Control
- All data shall be protected by role‑based access control.
- Supervisors shall only see logs of students assigned to them.
- Students shall only see their own logs.
- Administrators shall have full access to all data.
