import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { protect, restrictTo, checkPermission } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// All routes are protected
router.use(protect);

// Public doctor listings
router.get('/doctors', UserController.getDoctors);

// Admin only routes
router.get(
  '/',
  restrictTo(UserRole.ADMIN),
  checkPermission('manage_users'),
  UserController.getAllUsers
);

router.get(
  '/:id',
  restrictTo(UserRole.ADMIN),
  checkPermission('view_all_data'),
  UserController.getUserById
);

router.patch(
  '/:id',
  restrictTo(UserRole.ADMIN),
  checkPermission('manage_users'),
  UserController.updateUser
);

router.delete(
  '/:id',
  restrictTo(UserRole.ADMIN),
  checkPermission('manage_users'),
  UserController.deleteUser
);

router.patch(
  '/:id/deactivate',
  restrictTo(UserRole.ADMIN),
  checkPermission('manage_users'),
  UserController.deactivateUser
);

router.patch(
  '/:id/activate',
  restrictTo(UserRole.ADMIN),
  checkPermission('manage_users'),
  UserController.activateUser
);

router.post(
  '/:id/subscription',
  restrictTo(UserRole.ADMIN),
  checkPermission('manage_subscriptions'),
  UserController.updateUserSubscription
);

export default router;