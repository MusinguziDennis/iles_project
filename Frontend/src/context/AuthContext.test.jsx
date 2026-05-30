import { getDashboardPath } from './AuthContext';

describe('AuthContext helper functions', () => {
  test('getDashboardPath returns correct paths', () => {
    expect(getDashboardPath('student')).toBe('/student/dashboard');
    expect(getDashboardPath('work_supervisor')).toBe('/supervisor/dashboard');
    expect(getDashboardPath('university_supervisor')).toBe('/supervisor/dashboard');
    expect(getDashboardPath('admin')).toBe('/admin/dashboard');
    expect(getDashboardPath('unknown')).toBe('/');
  });
});
