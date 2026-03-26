# Non-Functional Requirements
## Performance
- The system shall respond to user actions within 2 seconds under normal load.
- The system shall support at least 100 concurrent users without noticeable degradation.
- Log submission and retrieval shall complete within 3 seconds.

## Security
- Passwords shall be hashed using a strong algorithm (e.g., PBKDF2, bcrypt).
- All data transmitted between client and server shall be encrypted using HTTPS.
- Role‑based access control shall be enforced at the application level.
- Sessions shall expire after 30 minutes of inactivity.
- Users shall be logged out after five failed login attempts.

## Usability
- The user interface shall be responsive and accessible on desktop and tablet devices.
- Forms shall provide inline validation messages.
- Navigation shall be intuitive, with clear labels and consistent layout.

## Reliability
- The system shall have 99% uptime during business hours (8 am–6 pm).
- Automated backups shall be performed daily.
- In case of server failure, recovery shall be possible within 2 hours.

## Maintainability
- The code shall follow Django best practices and be documented.
- Database migrations shall be version‑controlled.
- The system shall be modular to allow easy addition of new features.

## Scalability
- The system shall be designed to scale horizontally by adding more server instances if needed.
- Database queries shall be optimised to avoid performance bottlenecks.

## Compliance
- The system shall comply with data protection regulations (e.g., GDPR) by allowing users to request their data export and deletion.
