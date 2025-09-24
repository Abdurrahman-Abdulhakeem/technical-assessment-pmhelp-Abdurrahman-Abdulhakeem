import mongoose, { Document, Schema, Types } from 'mongoose';
import { IDoctorProfile } from '../types';

export interface IDoctorProfileDocument
  extends Omit<IDoctorProfile, "_id" | "userId">,
    Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
}

const availabilitySchema = new Schema({
  day: {
    type: String,
    required: true,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  },
  startTime: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format']
  },
  endTime: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format']
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const doctorProfileSchema = new Schema<IDoctorProfileDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true,
    maxlength: [100, 'Specialization cannot be more than 100 characters']
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true,
    trim: true
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience cannot be more than 50 years']
  },
  education: [{
    type: String,
    required: true,
    trim: true
  }],
  availability: [availabilitySchema],
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: [0, 'Consultation fee cannot be negative']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot be more than 5']
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: [0, 'Review count cannot be negative']
  }
}, {
  timestamps: true
});

// Indexes
doctorProfileSchema.index({ userId: 1 });
doctorProfileSchema.index({ specialization: 1 });
doctorProfileSchema.index({ rating: -1 });
doctorProfileSchema.index({ consultationFee: 1 });

// Virtual to populate user details
doctorProfileSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

export const DoctorProfileModel = mongoose.model<IDoctorProfileDocument>('DoctorProfile', doctorProfileSchema);
