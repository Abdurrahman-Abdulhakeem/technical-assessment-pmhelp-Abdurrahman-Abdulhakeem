import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { ResponseHandler } from '../utils/apiResponse';
import { UserService } from '../services/UserService';
import { AuthRequest, UserRole } from '../types';

export class UserController {
  static getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10, role, search } = req.query;
    
    const result = await UserService.getAllUsers({
      page: Number(page),
      limit: Number(limit),
      role: role as UserRole,
      search: search as string
    });

    ResponseHandler.success(res, 'Users retrieved successfully', result.users, 200, {
      pagination: result.pagination
    });
  });

  static getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await UserService.getUserById(id);

    ResponseHandler.success(res, 'User retrieved successfully', user);
  });

  static updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updateData = req.body;

    const user = await UserService.updateUser(id, updateData);

    ResponseHandler.success(res, 'User updated successfully', user);
  });

  static deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    await UserService.deleteUser(id);

    ResponseHandler.success(res, 'User deleted successfully');
  });

  static deactivateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await UserService.deactivateUser(id);

    ResponseHandler.success(res, 'User deactivated successfully', user);
  });

  static activateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await UserService.activateUser(id);

    ResponseHandler.success(res, 'User activated successfully', user);
  });

  static getDoctors = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10, specialization } = req.query;
    
    const result = await UserService.getDoctors({
      page: Number(page),
      limit: Number(limit),
      specialization: specialization as string
    });

    ResponseHandler.success(res, 'Doctors retrieved successfully', result.doctors, 200, {
      pagination: result.pagination
    });
  });

  static updateUserSubscription = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { subscriptionId } = req.body;

    const userSubscription = await UserService.updateUserSubscription(id, subscriptionId);

    ResponseHandler.success(res, 'User subscription updated successfully', userSubscription);
  });
}
