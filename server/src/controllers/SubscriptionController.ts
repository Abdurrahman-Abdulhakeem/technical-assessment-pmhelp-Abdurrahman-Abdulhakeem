import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { ResponseHandler } from '../utils/apiResponse';
import { SubscriptionService } from '../services/SubscriptionService';
import { AuthRequest } from '../types';

export class SubscriptionController {
  static getCurrentSubscription = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user!._id;
    const userSubscription = await SubscriptionService.getUserSubscription(userId.toString());

    ResponseHandler.success(res, 'Current subscription retrieved successfully', userSubscription);
  });

  static getAllSubscriptions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const subscriptions = await SubscriptionService.getAllSubscriptions();

    ResponseHandler.success(res, 'Subscriptions retrieved successfully', subscriptions);
  });

  static upgradeSubscription = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user!._id;
    const { subscriptionId } = req.body;

    const newSubscription = await SubscriptionService.upgradeSubscription(userId.toString(), subscriptionId);

    ResponseHandler.success(res, 'Subscription upgraded successfully', newSubscription);
  });

  static checkAppointmentLimit = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user!._id;
    const limitCheck = await SubscriptionService.checkAppointmentLimit(userId.toString());

    ResponseHandler.success(res, 'Appointment limit check completed', limitCheck);
  });
}