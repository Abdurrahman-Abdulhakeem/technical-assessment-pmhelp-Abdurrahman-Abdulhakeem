import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { ResponseHandler } from '../utils/apiResponse';
import { createSendToken } from '../utils/jwt';
import { AuthService } from '../services/AuthService';
import { AuthRequest } from '../types';
import { IUserDocument } from '@/models/User';

export class AuthController {
  static register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;
    
    const user = await AuthService.registerUser(userData);
    const { token, user: userOutput } = createSendToken(user, 201, res);

    ResponseHandler.success(res, 'User registered successfully', {
      token,
      user: userOutput
    }, 201);
  });

  static login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await AuthService.loginUser(email, password);
    const { token, user: userOutput } = createSendToken(user, 200, res);

    ResponseHandler.success(res, 'Login successful', {
      token,
      user: userOutput
    });
  });

  static logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    ResponseHandler.success(res, 'Logged out successfully');
  });

  static getMe = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    ResponseHandler.success(res, 'User data retrieved successfully', req.user);
  });

  static updateProfile = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { firstName, lastName, phone, dateOfBirth } = req.body;
    
    const user = req.user! as IUserDocument;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phone = phone || user.phone;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;

    await user.save();

    ResponseHandler.success(res, 'Profile updated successfully', user);
  });
}