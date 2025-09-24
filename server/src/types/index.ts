import { IUserDocument } from "@/models/User";
import { Request } from "express";
import { Types } from "mongoose";
import { ParsedQs } from "qs";

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin'
}

export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium'
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

export interface IUser {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  dateOfBirth?: Date;
  isActive: boolean;
  isEmailVerified: boolean;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscription {
  _id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  currency: string;
  features: string[];
  appointmentLimit: number;
  isActive: boolean;
  description: string;
}

export interface IUserSubscription {
  _id: string;
  userId: string | Types.ObjectId;
  subscriptionId: string | Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  appointmentsUsed: number;
  autoRenew: boolean;
  paymentMethod?: string | null;
}

export interface IAppointment {
  _id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: Date;
  duration: number; // in minutes
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMedicalRecord {
  _id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  diagnosis: string;
  symptoms: string[];
  treatment: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  notes: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IDoctorProfile {
  userId: string;
  specialization: string;
  licenseNumber: string;
  experience: number; // years
  education: string[];
  availability: Array<{
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }>;
  consultationFee: number;
  rating: number;
  reviewCount: number;
}

export interface IPatientProfile {
  userId: string | Types.ObjectId;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalHistory: string[];
  allergies: string[];
  bloodType?: string;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: string;
}

export interface AuthRequest<
  P = Record<string, any>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> extends Omit<Request<P, ResBody, ReqBody, ReqQuery, Locals>, "cookies"> {
  user?: IUserDocument;
  cookies: Record<string, any>;
}

// Permission System
export const PERMISSIONS = {
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

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS][number];

// Subscription Features
export const SUBSCRIPTION_FEATURES = {
  [SubscriptionTier.FREE]: {
    appointmentLimit: 2,
    features: [
      'Basic medical record access',
      'Standard support',
      '2 appointments per month'
    ],
    price: 0
  },
  [SubscriptionTier.BASIC]: {
    appointmentLimit: 5,
    features: [
      'Priority booking',
      'Email reminders',
      'Telehealth appointments',
      '5 appointments per month'
    ],
    price: 9.99
  },
  [SubscriptionTier.PREMIUM]: {
    appointmentLimit: -1, // unlimited
    features: [
      'Unlimited appointments',
      'Advanced medical history analytics',
      '24/7 support',
      'Family account sharing'
    ],
    price: 19.99
  }
} as const;
