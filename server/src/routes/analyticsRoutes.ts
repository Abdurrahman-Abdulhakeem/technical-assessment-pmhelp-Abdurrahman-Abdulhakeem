import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController';
import { protect, restrictTo, checkPermission } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// All routes are protected
router.use(protect);

// Doctor routes
router.get(
  '/practice',
  restrictTo(UserRole.DOCTOR),
  checkPermission('view_practice_analytics'),
  AnalyticsController.getDoctorPracticeAnalytics
);

// Patient routes
router.get(
  '/patient',
  restrictTo(UserRole.PATIENT),
  AnalyticsController.getPatientAnalytics
);

// Admin routes
router.get(
  '/system',
  restrictTo(UserRole.ADMIN),
  checkPermission('view_system_analytics'),
  AnalyticsController.getSystemAnalytics
);

router.get(
  '/appointments',
  restrictTo(UserRole.ADMIN),
  checkPermission('view_all_data'),
  AnalyticsController.getAppointmentAnalytics
);

router.get(
  '/subscriptions',
  restrictTo(UserRole.ADMIN),
  checkPermission('view_system_analytics'),
  AnalyticsController.getSubscriptionAnalytics
);

export default router;