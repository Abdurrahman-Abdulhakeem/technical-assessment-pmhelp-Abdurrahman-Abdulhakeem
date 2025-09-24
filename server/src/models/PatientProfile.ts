import mongoose, { Document, Schema } from 'mongoose';
import { IPatientProfile } from '../types';

export interface IPatientProfileDocument extends IPatientProfile, Document {}

const emergencyContactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Emergency contact name is required'],
    trim: true
  },
  relationship: {
    type: String,
    required: [true, 'Relationship is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Emergency contact phone is required'],
    match: [/^\+?[\d\s-()]+$/, 'Please provide a valid phone number']
  }
}, { _id: false });

const insuranceInfoSchema = new Schema({
  provider: {
    type: String,
    required: true,
    trim: true
  },
  policyNumber: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const patientProfileSchema = new Schema<IPatientProfileDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  emergencyContact: emergencyContactSchema,
  medicalHistory: [{
    type: String,
    trim: true
  }],
  allergies: [{
    type: String,
    trim: true
  }],
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    uppercase: true
  },
  insuranceInfo: insuranceInfoSchema
}, {
  timestamps: true
});

// Indexes
patientProfileSchema.index({ userId: 1 });

// Virtual to populate user details
patientProfileSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

export const PatientProfileModel = mongoose.model<IPatientProfileDocument>('PatientProfile', patientProfileSchema);
