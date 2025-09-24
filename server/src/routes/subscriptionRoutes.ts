import { Router } from 'express';
import { SubscriptionController } from '../controllers/SubscriptionController';
import { protect, restrictTo, checkPermission } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// Public routes
router.get('/', SubscriptionController.getAllSubscriptions);

// Protected routes
router.use(protect);

// Patient routes
router.get(
  '/current',
  restrictTo(UserRole.PATIENT),
  checkPermission('view_subscription'),
  SubscriptionController.getCurrentSubscription
);

router.post(
  '/upgrade',
  restrictTo(UserRole.PATIENT),
  checkPermission('upgrade_subscription'),
  SubscriptionController.upgradeSubscription
);

router.get(
  '/appointment-limit',
  restrictTo(UserRole.PATIENT),
  SubscriptionController.checkAppointmentLimit
);

export default router;
