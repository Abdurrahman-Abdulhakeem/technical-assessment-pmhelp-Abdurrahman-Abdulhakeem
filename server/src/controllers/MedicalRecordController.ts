import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { ResponseHandler } from '../utils/apiResponse';
import { MedicalRecordService } from '../services/MedicalRecordService';
import { AuthRequest, UserRole } from '../types';
import { AppError } from '../utils/appError';

export class MedicalRecordController {
  static createMedicalRecord = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const doctorId = req.user!._id;
    const recordData = { ...req.body, doctorId };

    const medicalRecord = await MedicalRecordService.createMedicalRecord(recordData);

    ResponseHandler.success(res, 'Medical record created successfully', medicalRecord, 201);
  });

  static getPatientRecords = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { patientId } = req.params;
    const user = req.user!;

    // Patients can only view their own records, doctors can view any patient's records
    if (user.role === UserRole.PATIENT && user._id !== patientId) {
      return next(new AppError('You can only view your own medical records', 403));
    }

    const records = await MedicalRecordService.getPatientRecords(patientId);

    ResponseHandler.success(res, 'Medical records retrieved successfully', records);
  });

  static getMyMedicalRecords = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const patientId = req.user!._id;
    const records = await MedicalRecordService.getPatientRecords(patientId.toString());

    ResponseHandler.success(res, 'Your medical records retrieved successfully', records);
  });

  static getMedicalRecordById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const record = await MedicalRecordService.getMedicalRecordById(id);

    ResponseHandler.success(res, 'Medical record retrieved successfully', record);
  });

  static updateMedicalRecord = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const doctorId = req.user!._id;
    const updateData = req.body;

    const record = await MedicalRecordService.updateMedicalRecord(id, updateData, doctorId.toString());

    ResponseHandler.success(res, 'Medical record updated successfully', record);
  });

  static deleteMedicalRecord = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const doctorId = req.user!._id;

    await MedicalRecordService.deleteMedicalRecord(id, doctorId.toString());

    ResponseHandler.success(res, 'Medical record deleted successfully');
  });
}