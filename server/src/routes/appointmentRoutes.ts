import { Router } from 'express';
import { AppointmentController } from '../controllers/AppointmentController';
import { protect, restrictTo, checkPermission } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { appointmentValidation } from '../utils/validation';
import { UserRole } from '../types';

const router = Router();

// All routes are protected
router.use(protect);

// Patient routes
router.post(
  '/',
  restrictTo(UserRole.PATIENT),
  checkPermission('book_appointment'),
  validate(appointmentValidation.book),
  AppointmentController.bookAppointment
);

router.get(
  '/my',
  checkPermission('view_own_appointments'),
  AppointmentController.getMyAppointments
);

// Doctor routes
router.get(
  '/doctor/:doctorId',
  restrictTo(UserRole.DOCTOR, UserRole.ADMIN),
  AppointmentController.getDoctorAppointments
);

// Shared routes
router.get('/:id', AppointmentController.getAppointmentById);

router.patch(
  '/:id/status',
  restrictTo(UserRole.DOCTOR, UserRole.ADMIN),
  validate(appointmentValidation.update),
  AppointmentController.updateAppointmentStatus
);

router.patch(
  '/:id/cancel',
  AppointmentController.cancelAppointment
);

export default router;