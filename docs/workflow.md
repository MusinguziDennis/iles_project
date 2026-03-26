# Workflow States

The weekly log follows a state machine with four primary states:

- **Draft** – The student is creating the log. It can be edited or deleted. Only the student can see it.
- **Submitted** – The student has submitted the log for review. It becomes visible to both the Workplace Supervisor and the Academic Supervisor. The log is read‑only for the student unless changes are requested.
- **Reviewed** – The Workplace Supervisor has read the log and marked it as reviewed. This indicates the workplace side has acknowledged it, but final approval may still be pending from the Academic Supervisor.
- **Approved** – The Academic Supervisor has approved the log. The log is locked and cannot be edited further.

## State Transitions

| From      | To        | Triggered by | Description |
|-----------|-----------|--------------|-------------|
| Draft     | Submitted | Student      | Student submits the log for review. |
| Submitted | Reviewed  | Workplace Supervisor | Workplace supervisor marks the log as reviewed. |
| Reviewed  | Approved  | Academic Supervisor | Academic supervisor approves the log (final). |
| Submitted | Submitted | Workplace Supervisor | Workplace supervisor requests changes; status stays Submitted (or can be set back to Draft depending on design). |
| Reviewed  | Submitted | Workplace Supervisor | Workplace supervisor requests changes after review; status returns to Submitted. |
| Submitted | Draft     | Academic Supervisor | Academic supervisor rejects the log with comments; student can edit again. |
| Approved  | (final)   | –              | No transitions from Approved. |

## Notes
- The Academic Supervisor can approve only after the Workplace Supervisor has reviewed (status = Reviewed). This ensures both parties have evaluated the log.
- Feedback from either supervisor is stored separately and does not change the log content.
- The student can resubmit a log after changes are requested.
