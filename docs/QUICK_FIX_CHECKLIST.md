# Quick Debugging Checklist

## 🔴 Critical Issues Fixed

### Issue #1: Validation Not Being Called
- **File**: `backend/apps/students/serializers.py` line 161
- **Problem**: Method was `validate_student()` but field is `student_id`
- **Fix Applied**: Renamed to `validate_student_id()` ✓
- **Impact**: UNIQUE constraint errors now caught by serializer, not database

### Issue #2: Missing Supervisor Data in API
- **File**: `backend/apps/supervisors/serializers.py` line 51-88
- **Problem**: `/api/supervisor/students/` response missing supervisor assignments
- **Fix Applied**: Added `workplace_supervisor_name` and `academic_supervisor_name` fields ✓
- **Impact**: Frontend can now display supervisor assignments

---

## 🚀 Immediate Actions

### 1. Run These Django Shell Commands (Verify Database State)
```bash
cd backend
python manage.py shell
```

```python
from apps.students.models import InternshipPlacement
from apps.users.models import User

# Check if any placements exist
count = InternshipPlacement.objects.count()
print(f"Total placements in DB: {count}")

# List all placements
for p in InternshipPlacement.objects.all():
    print(f"  Student: {p.student.username} | Company: {p.company_name}")
    print(f"    Work Sup: {p.workplace_supervisor} | Acad Sup: {p.academic_supervisor}")

# Check for duplicate students (should be 0)
from django.db.models import Count
dupes = User.objects.annotate(c=Count('placement')).filter(c__gt=1)
print(f"\nStudents with multiple placements: {dupes.count()}")
```

### 2. Test Duplicate Prevention (Verify Fix #1 Works)
```bash
python manage.py shell
```

```python
from apps.students.serializers import InternshipPlacementCreateUpdateSerializer
from apps.users.models import User
from datetime import date, timedelta

student = User.objects.filter(role='student').first()
data = {
    'student_id': student.id,
    'company_name': 'Test',
    'start_date': date.today() + timedelta(days=1),
    'end_date': date.today() + timedelta(days=30),
    'workplace_supervisor_id': None,
    'academic_supervisor_id': None,
}

s = InternshipPlacementCreateUpdateSerializer(data=data)
print("Is valid?", s.is_valid())
if not s.is_valid():
    print("Validation errors:", s.errors)
else:
    p = s.save()
    # Try duplicate
    s2 = InternshipPlacementCreateUpdateSerializer(data=data)
    print("\nDuplicate attempt - Valid?", s2.is_valid())
    print("Errors:", s2.errors)
```

### 3. Check API Response (Verify Fix #2 Works)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/supervisor/students/ | python -m json.tool
```

Should include: `workplace_supervisor_name` and `academic_supervisor_name` fields

### 4. Run Tests
```bash
python manage.py test apps.students apps.supervisors -v 2
```

---

## 📊 Root Cause Summary

| Issue | Was | Now |
|-------|-----|-----|
| Duplicate placements | Unvalidated, raw DB error | Caught by serializer ✓ |
| Supervisor assignments | Hidden from API | Visible in response ✓ |
| Data mismatch | API structure inconsistent | Complete and correct ✓ |

---

## 🔍 If Issues Persist

**Placements still show as empty?**
- Check database: do placements actually exist? (Run command #1 above)
- Verify `student_id` in placement matches logged-in user's ID

**Supervisors still showing as unassigned?**
- Check database: are `workplace_supervisor_id` and `academic_supervisor_id` filled?
- Verify supervisor user has correct role: `work_supervisor` or `university_supervisor`

**Still getting database constraint errors?**
- Clear browser cache
- Restart Django server: `python manage.py runserver`
- Re-test with fresh API request

---

## 📝 Files Modified
- ✓ `backend/apps/students/serializers.py` 
- ✓ `backend/apps/supervisors/serializers.py`

See `DEBUGGING_GUIDE.md` for full details and test scripts.
