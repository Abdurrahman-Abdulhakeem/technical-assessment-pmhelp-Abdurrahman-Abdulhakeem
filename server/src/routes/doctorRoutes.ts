import { Router } from 'express';
import { DoctorController } from '../controllers/DoctorController';
import { protect, restrictTo, checkPermission } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// Public routes
router.get('/:id/profile', DoctorController.getDoctorProfile);
router.get('/:id/availability', DoctorController.getDoctorAvailability);

// Protected routes
router.use(protect);

// Doctor only routes
router.get(
  '/profile/me',
  restrictTo(UserRole.DOCTOR),
  DoctorController.getMyProfile
);

router.patch(
  '/profile',
  restrictTo(UserRole.DOCTOR),
  checkPermission('manage_availability'),
  DoctorController.updateDoctorProfile
);

router.patch(
  '/availability',
  restrictTo(UserRole.DOCTOR),
  checkPermission('manage_availability'),
  DoctorController.updateAvailability
);

export default router;
