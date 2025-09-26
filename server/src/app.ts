import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

import { globalLimiter } from './middleware/rateLimiter';
import { globalErrorHandler } from './middleware/errorHandler';
import { AppError } from './utils/appError';
import routes from './routes';

const app = express();

// Trust proxy for accurate IP addresses (important for rate limiting)
app.set('trust proxy', 1);

// Global Middleware

// Security HTTP headers
app.use(helmet());

// Enable CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['sort', 'fields', 'page', 'limit', 'specialization', 'role']
}));

// Compression middleware
app.use(compression());

// Rate limiting
app.use(globalLimiter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'MedPortal API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API documentation endpoint
app.get('/api-docs', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'MedPortal API Documentation',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/v1/auth/register': 'Register a new user',
        'POST /api/v1/auth/login': 'Login user',
        'POST /api/v1/auth/logout': 'Logout user',
        'GET /api/v1/auth/me': 'Get current user',
        'PATCH /api/v1/auth/update-profile': 'Update user profile'
      },
      appointments: {
        'POST /api/v1/appointments': 'Book appointment (Patient only)',
        'GET /api/v1/appointments/my': 'Get user appointments',
        'GET /api/v1/appointments/:id': 'Get appointment by ID',
        'PATCH /api/v1/appointments/:id/status': 'Update appointment status (Doctor/Admin)',
        'PATCH /api/v1/appointments/:id/cancel': 'Cancel appointment'
      },
      subscriptions: {
        'GET /api/v1/subscriptions': 'Get all available subscriptions',
        'GET /api/v1/subscriptions/current': 'Get current user subscription (Patient)',
        'POST /api/v1/subscriptions/upgrade': 'Upgrade subscription (Patient)',
        'GET /api/v1/subscriptions/appointment-limit': 'Check appointment limit (Patient)'
      },
      medicalRecords: {
        'POST /api/v1/medical-records': 'Create medical record (Doctor only)',
        'GET /api/v1/medical-records/my': 'Get patient own records',
        'GET /api/v1/medical-records/patient/:patientId': 'Get patient records (Doctor)',
        'GET /api/v1/medical-records/:id': 'Get medical record by ID',
        'PATCH /api/v1/medical-records/:id': 'Update medical record (Doctor only)',
        'DELETE /api/v1/medical-records/:id': 'Delete medical record (Doctor only)'
      },
      doctors: {
        'GET /api/v1/doctors/:id/profile': 'Get doctor profile',
        'GET /api/v1/doctors/:id/availability': 'Get doctor availability',
        'GET /api/v1/doctors/profile/me': 'Get own profile (Doctor)',
        'PATCH /api/v1/doctors/profile': 'Update doctor profile (Doctor)',
        'PATCH /api/v1/doctors/availability': 'Update availability (Doctor)'
      },
      users: {
        'GET /api/v1/users': 'Get all users (Admin only)',
        'GET /api/v1/users/doctors': 'Get all doctors',
        'GET /api/v1/users/:id': 'Get user by ID (Admin only)',
        'PATCH /api/v1/users/:id': 'Update user (Admin only)',
        'DELETE /api/v1/users/:id': 'Delete user (Admin only)',
        'PATCH /api/v1/users/:id/deactivate': 'Deactivate user (Admin only)',
        'PATCH /api/v1/users/:id/activate': 'Activate user (Admin only)',
        'POST /api/v1/users/:id/subscription': 'Update user subscription (Admin only)'
      },
      analytics: {
        'GET /api/v1/analytics/practice': 'Get practice analytics (Doctor)',
        'GET /api/v1/analytics/patient': 'Get patient analytics (Patient)',
        'GET /api/v1/analytics/system': 'Get system analytics (Admin)',
        'GET /api/v1/analytics/appointments': 'Get appointment analytics (Admin)',
        'GET /api/v1/analytics/subscriptions': 'Get subscription analytics (Admin)'
      }
    },
    authentication: {
      type: 'Bearer Token (JWT)',
      header: 'Authorization: Bearer <token>',
      note: 'Include JWT token in Authorization header for protected routes'
    },
    roles: {
      PATIENT: 'Can book appointments, view own records, manage subscription',
      DOCTOR: 'Can manage appointments, access patient records, add medical notes',
      ADMIN: 'Can manage all users, view system analytics, manage subscriptions'
    }
  });
});

// API routes
app.use('/api/v1', routes);

// Handle undefined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

export default app;
