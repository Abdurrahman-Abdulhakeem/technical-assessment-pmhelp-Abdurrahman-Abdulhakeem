import { SubscriptionModel, ISubscriptionDocument } from '../models/Subscription';
import { UserSubscriptionModel, IUserSubscriptionDocument } from '../models/UserSubscription';
import { AppError } from '../utils/appError';
import { SubscriptionTier, SUBSCRIPTION_FEATURES } from '../types';

export class SubscriptionService {
  static async createDefaultSubscriptions(): Promise<void> {
    const subscriptions = [
      {
        name: 'Free Plan',
        tier: SubscriptionTier.FREE,
        price: SUBSCRIPTION_FEATURES.free.price,
        currency: 'USD',
        features: SUBSCRIPTION_FEATURES.free.features,
        appointmentLimit: SUBSCRIPTION_FEATURES.free.appointmentLimit,
        description: 'Basic access to medical portal features'
      },
      {
        name: 'Basic Plan',
        tier: SubscriptionTier.BASIC,
        price: SUBSCRIPTION_FEATURES.basic.price,
        currency: 'USD',
        features: SUBSCRIPTION_FEATURES.basic.features,
        appointmentLimit: SUBSCRIPTION_FEATURES.basic.appointmentLimit,
        description: 'Enhanced features with priority booking'
      },
      {
        name: 'Premium Plan',
        tier: SubscriptionTier.PREMIUM,
        price: SUBSCRIPTION_FEATURES.premium.price,
        currency: 'USD',
        features: SUBSCRIPTION_FEATURES.premium.features,
        appointmentLimit: SUBSCRIPTION_FEATURES.premium.appointmentLimit,
        description: 'Full access with unlimited appointments'
      }
    ];

    for (const sub of subscriptions) {
      const existing = await SubscriptionModel.findOne({ tier: sub.tier });
      if (!existing) {
        await SubscriptionModel.create(sub);
      }
    }
  }

  static async getUserSubscription(userId: string): Promise<IUserSubscriptionDocument | null> {
    return await UserSubscriptionModel.findOne({
      userId,
      isActive: true
    }).populate('subscription');
  }

  static async upgradeSubscription(
    userId: string, 
    newSubscriptionId: string
  ): Promise<IUserSubscriptionDocument> {
    // Deactivate current subscription
    await UserSubscriptionModel.updateMany(
      { userId, isActive: true },
      { isActive: false, endDate: new Date() }
    );

    // Create new subscription
    const newUserSubscription = await UserSubscriptionModel.create({
      userId,
      subscriptionId: newSubscriptionId,
      startDate: new Date(),
      isActive: true
    });

    return await UserSubscriptionModel.findById(newUserSubscription._id)
      .populate('subscription') as IUserSubscriptionDocument;
  }

  static async checkAppointmentLimit(userId: string): Promise<{
    canBook: boolean;
    remainingAppointments: number;
    subscriptionTier: SubscriptionTier;
  }> {
    const userSubscription = await this.getUserSubscription(userId);
    
    if (!userSubscription || !userSubscription.subscription) {
      throw new AppError('No active subscription found', 400);
    }

    const subscription = userSubscription.subscription as ISubscriptionDocument;
    const appointmentLimit = subscription.appointmentLimit;
    const appointmentsUsed = userSubscription.appointmentsUsed;

    // Unlimited appointments for premium
    if (appointmentLimit === -1) {
      return {
        canBook: true,
        remainingAppointments: -1,
        subscriptionTier: subscription.tier
      };
    }

    const remainingAppointments = appointmentLimit - appointmentsUsed;
    
    return {
      canBook: remainingAppointments > 0,
      remainingAppointments,
      subscriptionTier: subscription.tier
    };
  }

  static async incrementAppointmentCount(userId: string): Promise<void> {
    const userSubscription = await this.getUserSubscription(userId);
    
    if (userSubscription) {
      userSubscription.appointmentsUsed += 1;
      await userSubscription.save();
    }
  }

  static async getAllSubscriptions(): Promise<ISubscriptionDocument[]> {
    return await SubscriptionModel.find({ isActive: true }).sort({ price: 1 });
  }
}
