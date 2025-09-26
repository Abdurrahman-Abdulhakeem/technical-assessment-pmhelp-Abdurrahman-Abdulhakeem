export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
}

export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium',
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  phone?: string
  dateOfBirth?: string
  isActive: boolean
  isEmailVerified: boolean
  profilePicture?: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    token: string
    user: User
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
  phone?: string
  dateOfBirth?: string
}

export interface Subscription {
  _id: string
  name: string
  tier: SubscriptionTier
  price: number
  currency: string
  features: string[]
  appointmentLimit: number
  isActive: boolean
  description: string
}

export interface UserSubscription {
  _id: string
  userId: string
  subscriptionId: string
  startDate: string
  endDate?: string
  isActive: boolean
  appointmentsUsed: number
  autoRenew: boolean
  subscription: Subscription
}

export interface Appointment {
  _id: string
  patientId: string
  doctorId: string
  appointmentDate: string
  duration: number
  status: AppointmentStatus
  reason: string
  notes?: string
  createdAt: string
  updatedAt: string
  patient?: User
  doctor?: User
}

export interface BookAppointmentData {
  doctorId: string
  appointmentDate: string
  duration?: number
  reason: string
}

export interface MedicalRecord {
  _id: string
  patientId: string
  doctorId: string
  appointmentId?: string
  diagnosis: string
  symptoms: string[]
  treatment: string
  medications: Array<{
    name: string
    dosage: string
    frequency: string
    duration: string
  }>
  notes?: string
  attachments?: string[]
  createdAt: string
  updatedAt: string
  patient?: User
  doctor?: User
  appointment?: Appointment
}

export interface DoctorProfile {
  _id: string
  userId: string
  firstName: string
  lastName: string

  createdAt: string
  updatedAt: string
  user?: User
  profile: {
    licenseNumber: string
    experience: number
    specialization: string
    education: string[]
    availability: Array<{
      day: string
      startTime: string
      endTime: string
      isAvailable: boolean
      createdAt: string
      updatedAt: string
    }>
    consultationFee: number
    rating: number
    reviewCount: number
  }
}

export interface CreateMedicalRecordData {
  patientId: string
  appointmentId?: string
  diagnosis: string
  symptoms: string[]
  treatment: string
  medications?: Array<{
    name: string
    dosage: string
    frequency: string
    duration: string
  }>
  notes?: string
}

// Patient analytics
export interface PatientAnalytics {
  appointmentsCount: number
  medicalRecordsCount: number
  uniqueDoctorsVisited: number
  growthRate?: number
  healthScore?: number
}

// Practice analytics (for doctors)
export interface PracticeAnalytics {
  totalAppointments: number
  totalPatients: number
  totalHours: number
  averageDuration: number
  revenue?: number
  growthRate?: number
}

// System-wide analytics (for admins)
export interface SystemAnalytics {
  totalUsers: number
  totalDoctors: number
  totalPatients: number
  totalAppointments: number
  totalRevenue: number
  activeSubscriptions?: number
  growthRate?: number
  usersByRole?: {
    [key in UserRole]?: number
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  meta?: {
    pagination?: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  sort?: string
  search?: string
}
