# MedPortal Backend API

A comprehensive medical portal backend built with Node.js, Express, TypeScript, and MongoDB.

## Features

- **Role-based Authentication & Authorization** (Patient, Doctor, Admin)
- **Subscription Management** with rate limiting
- **Appointment Booking System** with conflict detection
- **Medical Records Management**
- **Analytics Dashboard** for all user types
- **Comprehensive API Documentation**
- **Professional Error Handling**
- **Security Best Practices** (Helmet, Rate Limiting, Input Sanitization)
- **Data Validation** with Joi
- **MongoDB with Mongoose ODM**

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd server
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` file with your configuration:
```
NODE_ENV=development
PORT=5000
DATABASE_URI=mongodb://localhost:27017/medportal
JWT_SECRET=your-super-secure-jwt-secret-here
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

4. Start MongoDB service

5. Seed the database (optional)
```bash
npm run seed
```

6. Start the development server
```bash
npm run dev
```

The server will start on http://localhost:5000

### Test Credentials (after seeding)
- **Admin**: admin@medportal.com / admin123456
- **Doctor**: dr.johnson@medportal.com / doctor123456
- **Patient**: patient1@example.com / patient123456

## API Documentation

Access the API documentation at: http://localhost:5000/api-docs

### Main Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user

#### Appointments
- `POST /api/v1/appointments` - Book appointment (Patient)
- `GET /api/v1/appointments/my` - Get user appointments
- `PATCH /api/v1/appointments/:id/cancel` - Cancel appointment

#### Subscriptions
- `GET /api/v1/subscriptions` - Get available plans
- `POST /api/v1/subscriptions/upgrade` - Upgrade subscription

#### Medical Records
- `POST /api/v1/medical-records` - Create record (Doctor)
- `GET /api/v1/medical-records/my` - Get patient records

## Project Structure

```
src/
├── config/          # Database configuration
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── scripts/         # Database seeding scripts
├── app.ts           # Express app configuration
└── server.ts        # Server entry point
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed database with test data
- `npm test` - Run tests

## Security Features

- JWT authentication with secure cookies
- Rate limiting per user role and subscription
- Input validation and sanitization
- MongoDB injection prevention
- CORS configuration
- Security headers with Helmet
- Password hashing with bcrypt

## Subscription Tiers

### Free Tier
- 2 appointments per month
- Basic medical record access

### Basic Tier ($9.99/month)
- 5 appointments per month
- Priority booking
- Email reminders

### Premium Tier ($19.99/month)
- Unlimited appointments
- Advanced analytics
- 24/7 support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
    {
      email: 'dr.johnson@medportal.com',
      password: 'doctor123456',
      firstName: 'Sarah',
      lastName: 'Johson',
      role: UserRole.DOCTOR,
      phone: '+1234567890',
      isEmailVerified: true,
      profile: {
        specialization: 'Cardiology',
        licenseNumber: 'MD001234',
        experience: 10,
        education: ['Harvard Medical School', 'Johns Hopkins Residency'],
        consultationFee: 200,
        availability: [
          { day: 'monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { day: 'tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { day: 'wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { day: 'thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { day: 'friday', startTime: '09:00', endTime: '17:00', isAvailable: true }
        ]
      }
    },

