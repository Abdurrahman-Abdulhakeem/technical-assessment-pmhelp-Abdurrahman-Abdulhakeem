import { z } from 'zod';
import { UserRole } from '@/types';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  role: z.enum([UserRole.PATIENT, UserRole.DOCTOR]),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

export const bookAppointmentSchema = z.object({
  doctorId: z.string().min(1, 'Please select a doctor'),
  appointmentDate: z.string().min(1, 'Please select an appointment date'),
  duration: z.number().min(15).max(120).default(30),
  reason: z.string().min(5, 'Please provide a reason (min 5 characters)').max(500),
});

export const medicalRecordSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  appointmentId: z.string().optional(),
  diagnosis: z.string().min(5, 'Diagnosis must be at least 5 characters'),
  symptoms: z.array(z.string()).min(1, 'At least one symptom is required'),
  treatment: z.string().min(5, 'Treatment must be at least 5 characters'),
  medications: z.array(z.object({
    name: z.string().min(1, 'Medication name is required'),
    dosage: z.string().min(1, 'Dosage is required'),
    frequency: z.string().min(1, 'Frequency is required'),
    duration: z.string().min(1, 'Duration is required'),
  })).optional(),
  notes: z.string().optional(),
});
