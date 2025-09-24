import mongoose, { Document, Schema, Types } from 'mongoose';
import { IMedicalRecord } from '../types';

export interface IMedicalRecordDocument extends Omit<IMedicalRecord, "_id" | "patientId" | "doctorId" | "appointmentId">, Document {
  _id: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  appointmentId?: Types.ObjectId;
}
const medicationSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Medication name is required']
  },
  dosage: {
    type: String,
    required: [true, 'Dosage is required']
  },
  frequency: {
    type: String,
    required: [true, 'Frequency is required']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  }
}, { _id: false });

const medicalRecordSchema = new Schema<IMedicalRecordDocument>({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient ID is required']
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Doctor ID is required']
  },
  appointmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Appointment',
    default: null
  },
  diagnosis: {
    type: String,
    required: [true, 'Diagnosis is required'],
    minlength: [5, 'Diagnosis must be at least 5 characters'],
    maxlength: [1000, 'Diagnosis cannot be more than 1000 characters']
  },
  symptoms: [{
    type: String,
    required: true,
    trim: true
  }],
  treatment: {
    type: String,
    required: [true, 'Treatment is required'],
    minlength: [5, 'Treatment must be at least 5 characters'],
    maxlength: [2000, 'Treatment cannot be more than 2000 characters']
  },
  medications: [medicationSchema],
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot be more than 2000 characters']
  },
  attachments: [{
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Attachment must be a valid URL'
    }
  }]
}, {
  timestamps: true
});

// Indexes
medicalRecordSchema.index({ patientId: 1 });
medicalRecordSchema.index({ doctorId: 1 });
medicalRecordSchema.index({ appointmentId: 1 });
medicalRecordSchema.index({ createdAt: -1 });

// Compound indexes
medicalRecordSchema.index({ patientId: 1, createdAt: -1 });
medicalRecordSchema.index({ doctorId: 1, createdAt: -1 });

// Virtual to populate patient details
medicalRecordSchema.virtual('patient', {
  ref: 'User',
  localField: 'patientId',
  foreignField: '_id',
  justOne: true
});

// Virtual to populate doctor details
medicalRecordSchema.virtual('doctor', {
  ref: 'User',
  localField: 'doctorId',
  foreignField: '_id',
  justOne: true
});

// Virtual to populate appointment details
medicalRecordSchema.virtual('appointment', {
  ref: 'Appointment',
  localField: 'appointmentId',
  foreignField: '_id',
  justOne: true
});

export const MedicalRecordModel = mongoose.model<IMedicalRecordDocument>('MedicalRecord', medicalRecordSchema);
