import mongoose, { Document, Schema, Types } from 'mongoose';
import { ISubscription, SubscriptionTier } from '../types';

export interface ISubscriptionDocument extends Omit<ISubscription, '_id'>, Document {
  _id: Types.ObjectId;
}
const subscriptionSchema = new Schema<ISubscriptionDocument>({
  name: {
    type: String,
    required: [true, 'Subscription name is required'],
    unique: true,
    trim: true
  },
  tier: {
    type: String,
    enum: Object.values(SubscriptionTier),
    required: [true, 'Subscription tier is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  features: [{
    type: String,
    required: true
  }],
  appointmentLimit: {
    type: Number,
    required: [true, 'Appointment limit is required'],
    min: [-1, 'Appointment limit must be -1 (unlimited) or positive number']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

subscriptionSchema.index({ tier: 1 });
subscriptionSchema.index({ isActive: 1 });

export const SubscriptionModel = mongoose.model<ISubscriptionDocument>('Subscription', subscriptionSchema);
