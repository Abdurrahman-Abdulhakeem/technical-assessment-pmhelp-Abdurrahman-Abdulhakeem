import mongoose, { Document, Schema, Types } from 'mongoose';
import { IUserSubscription } from '../types';
import { ISubscriptionDocument } from "./Subscription";
import { IUserDocument } from "./User";

export interface IUserSubscriptionDocument extends Omit<IUserSubscription, "_id">, Document {
  userId: Types.ObjectId | string;
  subscriptionId: Types.ObjectId | string;

    // Virtuals (populated)
  subscription?: ISubscriptionDocument;
  user?: IUserDocument;
}

const userSubscriptionSchema = new Schema<IUserSubscriptionDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  subscriptionId: {
    type: Schema.Types.ObjectId,
    ref: 'Subscription',
    required: [true, 'Subscription ID is required'],
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    default: Date.now,
  },
  endDate: {
    type: Date,
    validate: {
      validator: function (this: IUserSubscriptionDocument, v: Date) {
        return !v || v > this.startDate;
      },
      message: 'End date must be after start date',
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  appointmentsUsed: {
    type: Number,
    default: 0,
    min: [0, 'Appointments used cannot be negative'],
  },
  autoRenew: {
    type: Boolean,
    default: false,
  },
  paymentMethod: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// Indexes
userSubscriptionSchema.index({ userId: 1 });
userSubscriptionSchema.index({ subscriptionId: 1 });
userSubscriptionSchema.index({ startDate: 1, endDate: 1 });
userSubscriptionSchema.index({ isActive: 1 });
userSubscriptionSchema.index({ userId: 1, isActive: 1 });

// Virtuals
userSubscriptionSchema.virtual('subscription', {
  ref: 'Subscription',
  localField: 'subscriptionId',
  foreignField: '_id',
  justOne: true,
});

userSubscriptionSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

export const UserSubscriptionModel = mongoose.model<IUserSubscriptionDocument>(
  'UserSubscription',
  userSubscriptionSchema
);
