import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { ResponseHandler } from '../utils/apiResponse';
import { AnalyticsService } from '../services/AnalyticsService';
import { AuthRequest } from '../types';

export class AnalyticsController {
  static getDoctorPracticeAnalytics = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const doctorId = req.user!._id.toString();
    const { startDate, endDate } = req.query;

    const analytics = await AnalyticsService.getDoctorPracticeAnalytics(
      doctorId,
      startDate as string,
      endDate as string
    );

    ResponseHandler.success(res, 'Practice analytics retrieved successfully', analytics);
  });

  static getSystemAnalytics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate } = req.query;

    const analytics = await AnalyticsService.getSystemAnalytics(
      startDate as string,
      endDate as string
    );

    ResponseHandler.success(res, 'System analytics retrieved successfully', analytics);
  });

  static getAppointmentAnalytics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate } = req.query;

    const analytics = await AnalyticsService.getAppointmentAnalytics(
      startDate as string,
      endDate as string
    );

    ResponseHandler.success(res, 'Appointment analytics retrieved successfully', analytics);
  });

  static getSubscriptionAnalytics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const analytics = await AnalyticsService.getSubscriptionAnalytics();

    ResponseHandler.success(res, 'Subscription analytics retrieved successfully', analytics);
  });

  static getPatientAnalytics = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const patientId = req.user!._id.toString();
    const { startDate, endDate } = req.query;

    const analytics = await AnalyticsService.getPatientAnalytics(
      patientId,
      startDate as string,
      endDate as string
    );

    ResponseHandler.success(res, 'Patient analytics retrieved successfully', analytics);
  });
}
