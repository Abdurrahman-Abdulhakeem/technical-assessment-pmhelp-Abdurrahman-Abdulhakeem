import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { ResponseHandler } from '../utils/apiResponse';
import { AppointmentService } from '../services/AppointmentService';
import { AuthRequest, UserRole } from '../types';
import { AppError } from '../utils/appError';

export class AppointmentController {
  static bookAppointment = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { doctorId, appointmentDate, duration, reason } = req.body;
    const patientId = req.user!._id.toString();

    const appointment = await AppointmentService.bookAppointment({
      patientId,
      doctorId,
      appointmentDate: new Date(appointmentDate),
      duration,
      reason
    });

    ResponseHandler.success(res, 'Appointment booked successfully', appointment, 201);
  });

  static getMyAppointments = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user!;
    let appointments;

    if (user.role === UserRole.PATIENT) {
      appointments = await AppointmentService.getPatientAppointments(user._id.toString());
    } else if (user.role === UserRole.DOCTOR) {
      appointments = await AppointmentService.getDoctorAppointments(user._id.toString());
    } else {
      return next(new AppError('Invalid user role for this operation', 400));
    }

    ResponseHandler.success(res, 'Appointments retrieved successfully', appointments);
  });

  static getAppointmentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const appointment = await AppointmentService.getAppointmentById(id);

    ResponseHandler.success(res, 'Appointment retrieved successfully', appointment);
  });

  static updateAppointmentStatus = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status, notes } = req.body;

    const appointment = await AppointmentService.updateAppointmentStatus(id, status, notes);

    ResponseHandler.success(res, 'Appointment status updated successfully', appointment);
  });

  static cancelAppointment = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user!._id;

    const appointment = await AppointmentService.cancelAppointment(id, userId.toString());

    ResponseHandler.success(res, 'Appointment cancelled successfully', appointment);
  });

  static getDoctorAppointments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { doctorId } = req.params;
    const appointments = await AppointmentService.getDoctorAppointments(doctorId);

    ResponseHandler.success(res, 'Doctor appointments retrieved successfully', appointments);
  });
}