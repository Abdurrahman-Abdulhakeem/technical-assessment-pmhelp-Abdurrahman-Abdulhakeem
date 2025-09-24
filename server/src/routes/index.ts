import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import appointmentRoutes from './appointmentRoutes';
import subscriptionRoutes from './subscriptionRoutes';
import medicalRecordRoutes from './medicalRecordRoutes';
import doctorRoutes from './doctorRoutes';
import analyticsRoutes from './analyticsRoutes';

const router = Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/medical-records', medicalRecordRoutes);
router.use('/doctors', doctorRoutes);
router.use('/analytics', analyticsRoutes);

export default router;