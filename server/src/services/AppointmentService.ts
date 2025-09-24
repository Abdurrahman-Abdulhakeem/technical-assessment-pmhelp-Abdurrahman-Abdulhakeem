import { AppointmentModel, IAppointmentDocument } from '../models/Appointment';
import { UserModel } from '../models/User';
import { AppError } from '../utils/appError';
import { UserRole, AppointmentStatus } from '../types';
import { SubscriptionService } from './SubscriptionService';

export class AppointmentService {
  static async bookAppointment(appointmentData: {
    patientId: string;
    doctorId: string;
    appointmentDate: Date;
    duration?: number;
    reason: string;
  }): Promise<IAppointmentDocument> {
    const { patientId, doctorId, appointmentDate, duration = 30, reason } = appointmentData;

    // Verify doctor exists and is a doctor
    const doctor = await UserModel.findById(doctorId);
    if (!doctor || doctor.role !== UserRole.DOCTOR) {
      throw new AppError('Invalid doctor selected', 400);
    }

    // Check subscription limits
    const appointmentCheck = await SubscriptionService.checkAppointmentLimit(patientId);
    if (!appointmentCheck.canBook) {
      throw new AppError('You have reached your appointment limit. Please upgrade your subscription.', 400);
    }

    // Check for appointment conflicts
    const conflictingAppointment = await AppointmentModel.findOne({
      doctorId,
      appointmentDate: {
        $gte: new Date(appointmentDate.getTime() - duration * 60000),
        $lt: new Date(appointmentDate.getTime() + duration * 60000)
      },
      status: { $nin: [AppointmentStatus.CANCELLED] }
    });

    if (conflictingAppointment) {
      throw new AppError('Doctor is not available at this time', 400);
    }

    // Create appointment
    const appointment = await AppointmentModel.create({
      patientId,
      doctorId,
      appointmentDate,
      duration,
      reason,
      status: AppointmentStatus.SCHEDULED
    });

    // Increment appointment count
    await SubscriptionService.incrementAppointmentCount(patientId);

    return await AppointmentModel.findById(appointment._id)
      .populate('patient', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName email') as IAppointmentDocument;
  }

  static async getPatientAppointments(patientId: string): Promise<IAppointmentDocument[]> {
    return await AppointmentModel.find({ patientId })
      .populate('doctor', 'firstName lastName email')
      .sort({ appointmentDate: -1 });
  }

  static async getDoctorAppointments(doctorId: string): Promise<IAppointmentDocument[]> {
    return await AppointmentModel.find({ doctorId })
      .populate('patient', 'firstName lastName email phone')
      .sort({ appointmentDate: 1 });
  }

  static async updateAppointmentStatus(
    appointmentId: string,
    status: AppointmentStatus,
    notes?: string
  ): Promise<IAppointmentDocument> {
    const appointment = await AppointmentModel.findByIdAndUpdate(
      appointmentId,
      { status, ...(notes && { notes }) },
      { new: true, runValidators: true }
    ).populate('patient', 'firstName lastName email')
     .populate('doctor', 'firstName lastName email');

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    return appointment;
  }

  static async getAppointmentById(appointmentId: string): Promise<IAppointmentDocument> {
    const appointment = await AppointmentModel.findById(appointmentId)
      .populate('patient', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName email');

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    return appointment;
  }

  static async cancelAppointment(appointmentId: string, userId: string): Promise<IAppointmentDocument> {
    const appointment = await AppointmentModel.findById(appointmentId);
    
    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    // Check if user has permission to cancel
    if (appointment.patientId.toString() !== userId && appointment.doctorId.toString() !== userId) {
      throw new AppError('You are not authorized to cancel this appointment', 403);
    }

    return await this.updateAppointmentStatus(appointmentId, AppointmentStatus.CANCELLED);
  }
}