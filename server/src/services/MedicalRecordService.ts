import { MedicalRecordModel, IMedicalRecordDocument } from '../models/MedicalRecord';
import { UserModel } from '../models/User';
import { AppError } from '../utils/appError';
import { UserRole } from '../types';

export class MedicalRecordService {
  static async createMedicalRecord(recordData: {
    patientId: string;
    doctorId: string;
    appointmentId?: string;
    diagnosis: string;
    symptoms: string[];
    treatment: string;
    medications?: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
    }>;
    notes?: string;
    attachments?: string[];
  }): Promise<IMedicalRecordDocument> {
    // Verify patient exists
    const patient = await UserModel.findById(recordData.patientId);
    if (!patient || patient.role !== UserRole.PATIENT) {
      throw new AppError('Invalid patient selected', 400);
    }

    const record = await MedicalRecordModel.create(recordData);
    
    return await MedicalRecordModel.findById(record._id)
      .populate('patient', 'firstName lastName email dateOfBirth')
      .populate('doctor', 'firstName lastName email')
      .populate('appointment') as IMedicalRecordDocument;
  }

  static async getPatientRecords(patientId: string): Promise<IMedicalRecordDocument[]> {
    return await MedicalRecordModel.find({ patientId })
      .populate('doctor', 'firstName lastName specialization')
      .populate('appointment', 'appointmentDate status')
      .sort({ createdAt: -1 });
  }

  static async getMedicalRecordById(recordId: string): Promise<IMedicalRecordDocument> {
    const record = await MedicalRecordModel.findById(recordId)
      .populate('patient', 'firstName lastName email dateOfBirth')
      .populate('doctor', 'firstName lastName email')
      .populate('appointment');

    if (!record) {
      throw new AppError('Medical record not found', 404);
    }

    return record;
  }

  static async updateMedicalRecord(
    recordId: string, 
    updateData: Partial<IMedicalRecordDocument>,
    doctorId: string
  ): Promise<IMedicalRecordDocument> {
    const record = await MedicalRecordModel.findById(recordId);
    
    if (!record) {
      throw new AppError('Medical record not found', 404);
    }

    // Only the doctor who created the record can update it
    if (record.doctorId.toString() !== doctorId) {
      throw new AppError('You can only update your own medical records', 403);
    }

    const updatedRecord = await MedicalRecordModel.findByIdAndUpdate(
      recordId,
      updateData,
      { new: true, runValidators: true }
    ).populate('patient', 'firstName lastName email')
     .populate('doctor', 'firstName lastName email');

    return updatedRecord!;
  }

  static async deleteMedicalRecord(recordId: string, doctorId: string): Promise<void> {
    const record = await MedicalRecordModel.findById(recordId);
    
    if (!record) {
      throw new AppError('Medical record not found', 404);
    }

    // Only the doctor who created the record can delete it
    if (record.doctorId.toString() !== doctorId) {
      throw new AppError('You can only delete your own medical records', 403);
    }

    await MedicalRecordModel.findByIdAndDelete(recordId);
  }

  static async getDoctorRecords(doctorId: string): Promise<IMedicalRecordDocument[]> {
    return await MedicalRecordModel.find({ doctorId })
      .populate('patient', 'firstName lastName email')
      .populate('appointment', 'appointmentDate')
      .sort({ createdAt: -1 });
  }
}