import mongoose, { Document, Schema, ObjectId } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, UserRole } from "../types";

export interface IUserDocument extends Omit<IUser, "_id">, Document {
  _id: ObjectId;
  save(): Promise<this>;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot be more than 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot be more than 50 characters"],
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: [true, "User role is required"],
    },
    phone: {
      type: String,
      sparse: true,
      match: [/^\+?[\d\s-()]+$/, "Please provide a valid phone number"],
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function (v: Date) {
          return v < new Date();
        },
        message: "Date of birth must be in the past",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret._id = ret._id.toString();
        delete ret.password;
        return ret;
      },
    },
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model<IUserDocument>("User", userSchema);
