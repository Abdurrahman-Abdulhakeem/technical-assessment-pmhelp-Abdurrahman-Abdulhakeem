import { Router } from 'express';
import { MedicalRecordController } from '../controllers/MedicalRecordController';
import { protect, restrictTo, checkPermission } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { medicalRecordValidation } from '../utils/validation';
import { UserRole } from '../types';

const router = Router();

// All routes are protected
router.use(protect);

// Patient routes
router.get(
  '/my',
  restrictTo(UserRole.PATIENT),
  checkPermission('view_own_records'),
  MedicalRecordController.getMyMedicalRecords
);

// Doctor routes
router.post(
  '/',
  restrictTo(UserRole.DOCTOR),
  checkPermission('add_medical_notes'),
  validate(medicalRecordValidation.create),
  MedicalRecordController.createMedicalRecord
);

// Shared routes (with permission checks in controller)
router.get('/patient/:patientId', MedicalRecordController.getPatientRecords);
router.get('/:id', MedicalRecordController.getMedicalRecordById);

// Doctor only routes
router.patch(
  '/:id',
  restrictTo(UserRole.DOCTOR),
  checkPermission('add_medical_notes'),
  MedicalRecordController.updateMedicalRecord
);

router.delete(
  '/:id',
  restrictTo(UserRole.DOCTOR),
  checkPermission('add_medical_notes'),
  MedicalRecordController.deleteMedicalRecord
);

export default router;
