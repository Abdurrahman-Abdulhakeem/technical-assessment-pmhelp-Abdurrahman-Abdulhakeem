import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { ResponseHandler } from '../utils/apiResponse';
import { DoctorService } from '../services/DoctorService';
import { AuthRequest } from '../types';

export class DoctorController {
  static updateDoctorProfile = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const doctorId = req.user!._id;
    const profileData = req.body;

    const profile = await DoctorService.updateDoctorProfile(doctorId.toString(), profileData);

    ResponseHandler.success(res, 'Doctor profile updated successfully', profile);
  });

  static getDoctorProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const profile = await DoctorService.getDoctorProfile(id);

    ResponseHandler.success(res, 'Doctor profile retrieved successfully', profile);
  });

  static getMyProfile = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const doctorId = req.user!._id;
    const profile = await DoctorService.getDoctorProfile(doctorId.toString());

    ResponseHandler.success(res, 'Your profile retrieved successfully', profile);
  });

  static updateAvailability = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const doctorId = req.user!._id;
    const { availability } = req.body;

    const profile = await DoctorService.updateAvailability(doctorId.toString(), availability);

    ResponseHandler.success(res, 'Availability updated successfully', profile);
  });

  static getDoctorAvailability = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { date } = req.query;

    const availability = await DoctorService.getDoctorAvailability(id, date as string);

    ResponseHandler.success(res, 'Doctor availability retrieved successfully', availability);
  });
}