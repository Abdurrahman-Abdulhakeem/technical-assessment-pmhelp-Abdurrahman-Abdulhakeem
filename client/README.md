# 🏥 MedPortal - Complete Healthcare Management Platform

A comprehensive, modern medical portal built with cutting-edge technologies for exceptional user experience and robust functionality.

## 🌟 Features

# 🏥 MedPortal - Complete Healthcare Management Platform

A comprehensive, modern medical portal built with cutting-edge technologies for exceptional user experience and robust functionality.

## 🌟 Features

### 🎯 Role-Based Access Control
- **Patients**: Book appointments, view medical records, manage subscriptions
- **Doctors**: Manage appointments, create medical notes, view analytics
- **Admins**: Full system management, user oversight, platform analytics

### 💎 Modern UI/UX
- **Tailwind CSS Alpha**: Latest CSS-first approach without config files
- **Framer Motion**: Smooth animations and micro-interactions
- **Glass Morphism**: Beautiful backdrop blur effects
- **Responsive Design**: Perfect on all devices
- **Dark Mode Support**: System preference detection

### 🔐 Security & Performance
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Subscription-based API limits
- **Input Validation**: Zod schema validation
- **Error Handling**: Comprehensive error boundaries
- **Query Optimization**: TanStack Query caching

### 📊 Subscription Management
- **Free Tier**: 2 appointments/month, basic features
- **Basic Tier**: 5 appointments/month, priority booking
- **Premium Tier**: Unlimited appointments, advanced analytics

## 🛠️ Tech Stack

### Backend
```
Node.js + Express + TypeScript
MongoDB + Mongoose
JWT Authentication
Rate Limiting + Security Headers
Comprehensive API Documentation
```

### Frontend
```
React 18 + TypeScript + Vite
Tailwind CSS Alpha (CSS-first)
TanStack Router + Query
Framer Motion + Headless UI
Form Handling + Validation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 5+
- npm/yarn/pnpm

### Backend Setup
```bash
# Navigate to backend
cd medportal-backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start MongoDB service
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Seed database (optional)
npm run seed

# Start development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to frontend
cd medportal-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 🌐 Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health

## 🎭 Test Credentials

### Admin User
```
Email: admin@medportal.com
Password: admin123456
```

### Doctor Users
```
Dr. Smith (Cardiology)
Email: dr.smith@medportal.com
Password: doctor123456

Dr. Johnson (Dermatology)
Email: dr.johnson@medportal.com
Password: doctor123456
```

### Patient Users
```
Alice Williams
Email: patient1@example.com
Password: patient123456

Michael Brown
Email: patient2@example.com
Password: patient123456
```

## 🏗️ Project Structure

```
medportal/
├── medportal-backend/
│   ├── src/
│   │   ├── config/          # Database & app configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic layer
│   │   ├── types/           # TypeScript definitions
│   │   ├── utils/           # Helper functions
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── package.json
│   └── README.md
└── medportal-frontend/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── hooks/           # Custom React hooks
    │   ├── pages/           # Page components
    │   ├── routes/          # TanStack router config
    │   ├── services/        # API service layer
    │   ├── types/           # TypeScript definitions
    │   ├── utils/           # Helper functions
    │   ├── index.css        # Tailwind + custom styles
    │   └── main.tsx         # React entry point
    ├── package.json
    └── index.html
```

## 🔑 Key Features Implemented

### Authentication & Authorization
- [x] JWT-based authentication
- [x] Role-based permissions
- [x] Protected routes
- [x] Session management

### User Management
- [x] Multi-role registration
- [x] Profile management
- [x] Account activation/deactivation
- [x] Password security

### Appointment System
- [x] Appointment booking
- [x] Schedule management
- [x] Status tracking
- [x] Conflict detection
- [x] Cancellation system

### Medical Records
- [x] Electronic health records
- [x] Doctor notes
- [x] Medication tracking
- [x] File attachments
- [x] Access controls

### Subscription Management
- [x] Tiered pricing
- [x] Usage tracking
- [x] Upgrade/downgrade
- [x] Rate limiting

### Analytics Dashboard
- [x] Patient analytics
- [x] Doctor practice stats
- [x] System-wide metrics
- [x] Data visualization

## 🎨 Design System

### Color Palette
```css
Primary: Blue (#0ea5e9) to Purple (#8b5cf6)
Success: Green (#22c55e)
Warning: Yellow (#f59e0b)
Danger: Red (#ef4444)
Neutral: Slate (#64748b)
```

### Typography
```css
Headings: Inter, bold weights
Body: Inter, regular/medium
Code: JetBrains Mono
```

### Components
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Gradient backgrounds, smooth transitions
- **Forms**: Clean inputs with focus states
- **Navigation**: Modern sidebar with active states
- **Modals**: Glass morphism with backdrop blur

## 🔧 API Endpoints

### Authentication
```
POST /api/v1/auth/register    # User registration
POST /api/v1/auth/login       # User login
POST /api/v1/auth/logout      # User logout
GET  /api/v1/auth/me          # Get current user
PATCH /api/v1/auth/update-profile # Update profile
```

### Appointments
```
POST /api/v1/appointments     # Book appointment
GET  /api/v1/appointments/my  # Get user appointments
GET  /api/v1/appointments/:id # Get appointment details
PATCH /api/v1/appointments/:id/status # Update status
PATCH /api/v1/appointments/:id/cancel # Cancel appointment
```

### Subscriptions
```
GET  /api/v1/subscriptions           # Get all plans
GET  /api/v1/subscriptions/current   # Get current plan
POST /api/v1/subscriptions/upgrade   # Upgrade plan
GET  /api/v1/subscriptions/appointment-limit # Check limits
```

### Medical Records
```
POST /api/v1/medical-records         # Create record
GET  /api/v1/medical-records/my      # Get patient records
GET  /api/v1/medical-records/:id     # Get record details
PATCH /api/v1/medical-records/:id    # Update record
DELETE /api/v1/medical-records/:id   # Delete record
```

## 🚀 Deployment

### Environment Variables
```bash
# Backend (.env)
NODE_ENV=production
PORT=5000
DATABASE_URI=mongodb+srv://...
DATABASE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
FRONTEND_URL=https://your-domain.com

# Frontend (.env)
VITE_API_URL=https://api.your-domain.com/api/v1
VITE_APP_NAME=MedPortal
```

### Build Commands
```bash
# Backend
npm run build
npm start

# Frontend
npm run build
```


## 🧪 Testing

### Backend Testing
```bash
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Frontend Testing
```bash
npm run test              # Run component tests
npm run test:e2e          # End-to-end tests
npm run test:coverage     # Coverage report
```

## 📈 Performance Optimizations

### Backend
- **Database Indexing**: Optimized MongoDB queries
- **Rate Limiting**: Subscription-based limits
- **Compression**: Gzip response compression
- **Caching**: Query result caching
- **Connection Pooling**: MongoDB connection optimization

### Frontend
- **Code Splitting**: Route-based splitting
- **Query Caching**: TanStack Query optimization
- **Image Optimization**: Lazy loading, WebP format
- **Bundle Analysis**: Webpack bundle analyzer
- **Service Workers**: Offline functionality

## 🔒 Security Measures

### Backend Security
- **Helmet.js**: Security headers
- **CORS**: Cross-origin configuration
- **Rate Limiting**: API protection
- **Input Sanitization**: MongoDB injection prevention
- **JWT Security**: Secure token handling

### Frontend Security
- **CSP Headers**: Content Security Policy
- **XSS Protection**: Input sanitization
- **HTTPS Only**: Secure connections
- **Token Storage**: Secure storage practices

## 📱 Mobile Responsiveness

- **Breakpoints**: Mobile-first design
- **Touch Gestures**: Optimized interactions
- **Performance**: Optimized for mobile networks
- **PWA Ready**: Service worker implementation

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React ecosystem
- **Tailwind CSS** - For the beautiful utility-first CSS
- **TanStack** - For excellent data fetching and routing
- **Framer Motion** - For smooth animations
- **MongoDB** - For the flexible database solution

## 📞 Support

For support, email support@medportal.com or join our Slack channel.

---

**Built with ❤️ by the MedPortal Team**

*Revolutionizing healthcare management, one patient at a time.*