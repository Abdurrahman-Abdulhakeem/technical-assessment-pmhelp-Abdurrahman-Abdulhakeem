import { useCurrentUser } from './useAuth';
import { UserRole } from '@/types';

const PERMISSIONS: Record<UserRole, ReadonlyArray<string>> = {
  [UserRole.PATIENT]: [
    'view_own_records',
    'book_appointment',
    'view_own_appointments',
    'update_own_profile',
    'view_subscription',
    'upgrade_subscription'
  ],
  [UserRole.DOCTOR]: [
    'view_patient_records',
    'add_medical_notes',
    'manage_availability',
    'view_own_appointments',
    'update_own_profile',
    'view_practice_analytics'
  ],
  [UserRole.ADMIN]: [
    'manage_users',
    'view_all_data',
    'manage_subscriptions',
    'view_system_analytics',
    'manage_doctor_profiles',
    'manage_appointments'
  ]
} as const;

type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS][number];

export const usePermissions = () => {
  const { data: user } = useCurrentUser();

  const hasPermission = (permission: Permission): boolean => {
    if (!user?.role) return false;
    return PERMISSIONS[user.role].includes(permission) || false;
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: Array<UserRole>): boolean => {
    return user?.role ? roles.includes(user.role) : false;
  };

  return {
    user,
    hasPermission,
    hasRole,
    hasAnyRole,
    isPatient: hasRole(UserRole.PATIENT),
    isDoctor: hasRole(UserRole.DOCTOR),
    isAdmin: hasRole(UserRole.ADMIN),
  };
};
