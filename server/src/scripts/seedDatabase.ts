import dotenv from 'dotenv';
import { connectDatabase } from '../config/database';
import { UserModel } from '../models/User';
import { SubscriptionModel } from '../models/Subscription';
import { DoctorProfileModel } from '../models/DoctorProfile';
import { PatientProfileModel } from '../models/PatientProfile';
import { UserSubscriptionModel } from '../models/UserSubscription';
import { UserRole, SubscriptionTier } from '../types';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const seedData = {
  admin: {
    email: 'admin@medportal.com',
    password: 'admin123456',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
    isEmailVerified: true
  },
  doctors: [
    {
      email: 'dr.johnson@medportal.com',
      password: 'doctor123456',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: UserRole.DOCTOR,
      phone: '+1234567891',
      isEmailVerified: true,
      profile: {
        specialization: 'Dermatology',
        licenseNumber: 'MD001235',
        experience: 8,
        education: ['Stanford Medical School', 'UCLA Residency'],
        consultationFee: 180,
        availability: [
          { day: 'monday', startTime: '10:00', endTime: '18:00', isAvailable: true },
          { day: 'tuesday', startTime: '10:00', endTime: '18:00', isAvailable: true },
          { day: 'wednesday', startTime: '10:00', endTime: '18:00', isAvailable: true },
          { day: 'thursday', startTime: '10:00', endTime: '18:00', isAvailable: true },
          { day: 'friday', startTime: '10:00', endTime: '16:00', isAvailable: true }
        ]
      }
    }
  ],
  patients: [
    {
      email: 'patient1@example.com',
      password: 'patient123456',
      firstName: 'Alice',
      lastName: 'Williams',
      role: UserRole.PATIENT,
      phone: '+1234567892',
      dateOfBirth: new Date('1990-05-15'),
      isEmailVerified: true,
      profile: {
        emergencyContact: {
          name: 'Bob Williams',
          relationship: 'Spouse',
          phone: '+1234567893'
        },
        medicalHistory: ['Hypertension', 'Diabetes Type 2'],
        allergies: ['Penicillin', 'Peanuts'],
        bloodType: 'A+'
      }
    },
    {
      email: 'patient2@example.com',
      password: 'patient123456',
      firstName: 'Michael',
      lastName: 'Brown',
      role: UserRole.PATIENT,
      phone: '+1234567894',
      dateOfBirth: new Date('1985-08-22'),
      isEmailVerified: true,
      profile: {
        emergencyContact: {
          name: 'Lisa Brown',
          relationship: 'Sister',
          phone: '+1234567895'
        },
        medicalHistory: ['Asthma'],
        allergies: ['Dust', 'Shellfish'],
        bloodType: 'O-'
      }
    }
  ]
};

const seedDatabase = async (): Promise<void> => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await connectDatabase();

    // Clear existing data (be careful in production!)
    if (process.env.NODE_ENV !== 'production') {
      await UserModel.deleteMany({});
      await DoctorProfileModel.deleteMany({});
      await PatientProfileModel.deleteMany({});
      await UserSubscriptionModel.deleteMany({});
      console.log('🗑️  Cleared existing data');
    }

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = await UserModel.create(seedData.admin);
    console.log(`✅ Created admin: ${admin.email}`);

    // Create doctors
    console.log('👨‍⚕️ Creating doctors...');
    for (const doctorData of seedData.doctors) {
      const { profile, ...userData } = doctorData;
      const doctor = await UserModel.create(userData);
      
      // Create doctor profile
      await DoctorProfileModel.create({
        userId: doctor._id,
        ...profile
      });
      
      console.log(`✅ Created doctor: ${doctor.email}`);
    }

    // Create patients
    console.log('🏥 Creating patients...');
    const freeSubscription = await SubscriptionModel.findOne({ tier: SubscriptionTier.FREE });
    
    for (const patientData of seedData.patients) {
      const { profile, ...userData } = patientData;
      const patient = await UserModel.create(userData);
      
      // Create patient profile
      await PatientProfileModel.create({
        userId: patient._id,
        ...profile
      });

      // Assign free subscription
      if (freeSubscription) {
        await UserSubscriptionModel.create({
          userId: patient._id,
          subscriptionId: freeSubscription._id,
          startDate: new Date(),
          isActive: true
        });
      }
      
      console.log(`✅ Created patient: ${patient.email}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📋 Test Credentials:');
    console.log('Admin: admin@medportal.com / admin123456');
    console.log('Doctor 1: dr.smith@medportal.com / doctor123456');
    console.log('Doctor 2: dr.johnson@medportal.com / doctor123456');
    console.log('Patient 1: patient1@example.com / patient123456');
    console.log('Patient 2: patient2@example.com / patient123456');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;