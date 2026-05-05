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

```python
# AFTER (fixed):
workplace_supervisor_name = serializers.SerializerMethodField()
academic_supervisor_name = serializers.SerializerMethodField()

fields = (
    'id', 'student_id', 'student_name', 'student_email',
    'company_name', 'start_date', 'end_date',
    'workplace_supervisor_name', 'academic_supervisor_name',  # ← NOW INCLUDED
    'total_logs', 'pending_logs', 'approved_logs',
)

def get_workplace_supervisor_name(self, obj):
    if obj.workplace_supervisor:
        return obj.workplace_supervisor.get_full_name() or obj.workplace_supervisor.username
    return 'Unassigned'
```

### How to Verify
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/supervisor/students/
```

Expected response now includes `workplace_supervisor_name` and `academic_supervisor_name`:
```json
[
  {
    "id": 1,
    "student_id": 5,
    "student_name": "John Doe",
    "company_name": "Tech Corp",
    "workplace_supervisor_name": "Alice Smith",
    "academic_supervisor_name": "Prof. Bob Johnson",
    "total_logs": 5,
    "pending_logs": 1,
    "approved_logs": 4
  }
]
```

---

## ISSUE #3: Possible Missing Data (MEDIUM)

### Scenarios & Root Causes

#### Scenario A: "No placements" shown to students
```
Student logs in → Sees "No Placement Assigned"
```

**Root Cause Check**:
1. **No data in database**: Placements were never created
2. **Wrong student assignment**: Placement created with different user ID
3. **Filtering logic**: View filters `queryset.filter(student=user)` — if student ID doesn't match, it's hidden

**How to Debug**:
```python
# In Django shell:
from apps.students.models import InternshipPlacement
from apps.users.models import User

# See ALL placements
for p in InternshipPlacement.objects.all():
    print(f"Student: {p.student.id} ({p.student.username}) → Company: {p.company_name}")

# Check current user
from django.contrib.auth import get_user
user = get_user()  # Replace with actual login

# See their placement
try:
    my_placement = user.placement  # Uses related_name='placement'
    print(f"Found placement: {my_placement.company_name}")
except:
    print("No placement found for this student")
```

#### Scenario B: "No supervisors assigned" to students
```
Supervisor logs in → Sees "No students assigned"
```

**Root Cause Check**:
1. **Supervisors not set**: When creating placement, `workplace_supervisor_id` and `academic_supervisor_id` were left null
2. **Wrong supervisor role**: Assigned user with wrong role (not `work_supervisor` or `university_supervisor`)
3. **Filtering issue**: View uses `_get_student_ids()` which filters by related_name

**How to Debug**:
```python
# In Django shell:
from apps.students.models import InternshipPlacement
from apps.users.models import User

supervisor = User.objects.get(username='alice')  # Replace with supervisor username
print(f"Supervisor role: {supervisor.role}")

# Check placements they're assigned to
work_placements = supervisor.workplace_placements.all()
acad_placements = supervisor.academic_placements.all()

print(f"Workplace supervisions: {work_placements.count()}")
for p in work_placements:
    print(f"  - {p.student.get_full_name()}")

print(f"Academic supervisions: {acad_placements.count()}")
for p in acad_placements:
    print(f"  - {p.student.get_full_name()}")
```

---

## Full Data Flow Verification

### Test 1: Create Placement (End-to-End)
```bash
# Terminal 1: Backend
cd backend && python manage.py runserver

# Terminal 2: Test script
python
```

```python
import requests
import json

# Login
login_data = {
    'username': 'admin_user',  # Replace with test admin
    'password': 'your_password'
}
r = requests.post('http://localhost:8000/api/token/', json=login_data)
token = r.json()['access']

headers = {'Authorization': f'Bearer {token}'}

# Create placement
placement_data = {
    'student_id': 1,  # Replace with existing student ID
    'company_name': 'TechFlow Inc',
    'workplace_supervisor_id': 2,  # Replace with supervisor ID
    'academic_supervisor_id': 3,
    'start_date': '2025-05-01',
    'end_date': '2025-08-31',
}

r = requests.post(
    'http://localhost:8000/api/students/placements/',
    json=placement_data,
    headers=headers
)

print(f"Status: {r.status_code}")
print(f"Response:\n{json.dumps(r.json(), indent=2)}")

# Try duplicate (should be rejected by serializer)
r2 = requests.post(
    'http://localhost:8000/api/students/placements/',
    json=placement_data,
    headers=headers
)
print(f"\nDuplicate attempt - Status: {r2.status_code}")
print(f"Response:\n{json.dumps(r2.json(), indent=2)}")
```

**Expected Results**:
- ✓ First placement: HTTP 201 Created
- ✓ Duplicate: HTTP 400 Bad Request with message "This student already has an active placement."

### Test 2: Student Viewing Their Placement
```python
# Login as student
login_data = {'username': 'student_user', 'password': 'password'}
r = requests.post('http://localhost:8000/api/token/', json=login_data)
token = r.json()['access']

headers = {'Authorization': f'Bearer {token}'}

# Fetch their placement
r = requests.get('http://localhost:8000/api/students/placements/', headers=headers)
placements = r.json()

if isinstance(placements, list) and placements:
    p = placements[0]
    print(f"✓ Found placement: {p['company_name']}")
    print(f"  Workplace Supervisor: {p['workplace_supervisor_name']}")
    print(f"  Academic Supervisor: {p['academic_supervisor_name']}")
else:
    print("✗ No placements found (check database)")
```

### Test 3: Supervisor Viewing Assigned Students
```python
# Login as supervisor
login_data = {'username': 'supervisor_user', 'password': 'password'}
r = requests.post('http://localhost:8000/api/token/', json=login_data)
token = r.json()['access']

headers = {'Authorization': f'Bearer {token}'}

# Fetch assigned students
r = requests.get('http://localhost:8000/api/supervisor/students/', headers=headers)
students = r.json()

if isinstance(students, list) and students:
    for s in students:
        print(f"✓ Student: {s['student_name']}")
        print(f"  Company: {s['company_name']}")
        print(f"  Logs: {s['total_logs']} total, {s['pending_logs']} pending")
else:
    print("✗ No students assigned (check supervisor_id in placements)")
```

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "UNIQUE constraint failed on student_id" error from backend | Serializer validation not running | ✓ FIXED (see Issue #1) |
| Student sees "No Placement" but placement exists | Placement's `student` field doesn't match logged-in user ID | Check `InternshipPlacement.objects.filter(student_id=X)` |
| Supervisor sees "No students" | Placements don't have this supervisor assigned | Check placement's `workplace_supervisor_id` or `academic_supervisor_id` |
| API doesn't show supervisor names | Missing field in serializer | ✓ FIXED (see Issue #2) |
| Validation error is a database error, not user-friendly | Field validator method name doesn't match field name | ✓ FIXED (see Issue #1) |
| WeeklyLog creates but appears in wrong status | Check `WeeklyLog.status` choices and form submission | Verify status is one of: 'draft', 'submitted', 'reviewed', 'approved' |

---

## Summary of Changes Made

### Files Modified

1. **backend/apps/students/serializers.py**
   - Line 161: Renamed `validate_student()` → `validate_student_id()`
   - Added comment clarifying field-level validator naming

2. **backend/apps/supervisors/serializers.py**
   - Added `workplace_supervisor_name` field
   - Added `academic_supervisor_name` field
   - Added `get_workplace_supervisor_name()` method
   - Added `get_academic_supervisor_name()` method
   - Updated `fields` tuple in Meta class

---

## Next Steps

1. **Verify database state** using the diagnostic queries above
2. **Test the fixes** with the provided curl/Python test scripts
3. **Check if supervisors are being assigned** when creating placements
4. **Run tests** to ensure no regressions:
   ```bash
   python manage.py test apps.students apps.supervisors
   ```

5. **Monitor logs** for any serializer errors after the fix is deployed
