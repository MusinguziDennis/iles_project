# ILES Backend Debugging Guide

## Executive Summary
Your system has **3 interconnected issues** causing the data mismatch between database, API, and frontend:

1. **[CRITICAL]** Validation never triggers → UNIQUE constraint error leaks to frontend
2. **[HIGH]** Missing supervisor data in API responses → Frontend can't show assignments
3. **[MEDIUM]** Possible missing placement data → Students/supervisors see "no data"

---

## ISSUE #1: Validator Method Name Mismatch (CRITICAL)

### Location
`backend/apps/students/serializers.py` — **Lines 161-170** (NOW FIXED)

### What Was Wrong
```python
# BEFORE (broken):
def validate_student(self, value):  # ← Method name is WRONG
    if self.instance is None:
        if InternshipPlacement.objects.filter(student=value).exists():
            raise serializers.ValidationError(
                "This student already has an active placement."
            )
    return value
```

The field is named `student_id`, not `student`. DRF only calls field validators matching the actual field name.

**Result**: The validation NEVER runs. Duplicate placements bypass serializer validation and hit the database UNIQUE constraint instead, giving users a raw database error.

### What's Fixed
```python
# AFTER (fixed):
def validate_student_id(self, value):  # ← Matches the field name
    # ... same validation logic ...
```

### How to Verify the Fix Works
Run this test to confirm duplicates are now caught by serializer validation:

```bash
cd backend
python manage.py shell
```

```python
from apps.students.serializers import InternshipPlacementCreateUpdateSerializer
from apps.users.models import User
from datetime import date, timedelta

# Get a student
student = User.objects.filter(role='student').first()

# Create first placement
data1 = {
    'student_id': student.id,
    'company_name': 'Company A',
    'start_date': date.today() + timedelta(days=1),
    'end_date': date.today() + timedelta(days=30),
    'workplace_supervisor_id': None,
    'academic_supervisor_id': None,
}

s1 = InternshipPlacementCreateUpdateSerializer(data=data1)
if s1.is_valid():
    p1 = s1.save()
    print("✓ First placement created:", p1.id)
else:
    print("✗ First placement failed:", s1.errors)

# Try to create duplicate (should be rejected by serializer now)
s2 = InternshipPlacementCreateUpdateSerializer(data=data1)
is_valid = s2.is_valid()
print("\nAttempting duplicate:")
print("- Valid?", is_valid)
print("- Errors:", s2.errors)

if not is_valid and 'student_id' in s2.errors:
    print("✓ FIXED: Serializer validation caught the duplicate!")
else:
    print("✗ Still broken: Database error would be raised")
```

---

## ISSUE #2: Missing Supervisor Data in API Response (HIGH)

### Location
`backend/apps/supervisors/serializers.py` — **Lines 51-88** (NOW FIXED)

### What Was Wrong
When supervisors request `/api/supervisor/students/`, the response was missing supervisor assignment information:

```python
# BEFORE (incomplete):
fields = (
    'id', 'student_id', 'student_name', 'student_email',
    'company_name', 'start_date', 'end_date',
    'total_logs', 'pending_logs', 'approved_logs',
    # ← MISSING: workplace_supervisor_name, academic_supervisor_name
)
```

### Impact
- Supervisors can't see who else is assigned to their students
- Frontend trying to display "Assigned to: Jane Doe" has no data to show
- Admin dashboards showing supervisor assignments show nothing

### What's Fixed
Added supervisor name fields:

`
## Next Steps

1. **Verify database state** using the diagnostic queries above
2. **Test the fixes** with the provided curl/Python test scripts
3. **Check if supervisors are being assigned** when creating placements
4. **Run tests** to ensure no regressions:
   ```bash
   python manage.py test apps.students apps.supervisors
   ```

5. **Monitor logs** for any serializer errors after the fix is deployed
