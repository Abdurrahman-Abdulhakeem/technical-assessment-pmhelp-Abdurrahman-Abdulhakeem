import Joi from 'joi';
import { UserRole, SubscriptionTier } from '../types';

export const userValidation = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    role: Joi.string().valid(...Object.values(UserRole)).required(),
    phone: Joi.string().optional(),
    dateOfBirth: Joi.date().optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().optional(),
    dateOfBirth: Joi.date().optional()
  })
};

export const appointmentValidation = {
  book: Joi.object({
    doctorId: Joi.string().required(),
    appointmentDate: Joi.date().min('now').required(),
    duration: Joi.number().min(15).max(120).default(30),
    reason: Joi.string().min(5).max(500).required()
  }),

  update: Joi.object({
    appointmentDate: Joi.date().min('now').optional(),
    duration: Joi.number().min(15).max(120).optional(),
    reason: Joi.string().min(5).max(500).optional(),
    status: Joi.string().valid('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show').optional()
  })
};

export const medicalRecordValidation = {
  create: Joi.object({
    patientId: Joi.string().required(),
    appointmentId: Joi.string().optional(),
    diagnosis: Joi.string().min(5).max(1000).required(),
    symptoms: Joi.array().items(Joi.string()).min(1).required(),
    treatment: Joi.string().min(5).max(2000).required(),
    medications: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        dosage: Joi.string().required(),
        frequency: Joi.string().required(),
        duration: Joi.string().required()
      })
    ).optional(),
    notes: Joi.string().max(2000).optional()
  })
};
