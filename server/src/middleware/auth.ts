import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { verifyToken } from '../utils/jwt';
import { UserModel } from '../models/User';
import { UserRole, Permission, PERMISSIONS, AuthRequest } from '../types';

export const protect = catchAsync<AuthRequest>(async (req, res, next) => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("You are not logged in! Please log in to get access.", 401));
  }

  const decoded = verifyToken(token);

  const currentUser = await UserModel.findById(decoded.id).select("+password");
  if (!currentUser) {
    return next(new AppError("The user belonging to this token does no longer exist.", 401));
  }

  if (!currentUser.isActive) {
    return next(new AppError("Your account has been deactivated. Please contact support.", 401));
  }

  req.user = currentUser;
  next();
});


export const restrictTo = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('You are not logged in!', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};

export const checkPermission = (permission: Permission) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('You are not logged in!', 401));
    }

    const userPermissions = PERMISSIONS[req.user.role as UserRole] as readonly Permission[];
    if (!userPermissions.includes(permission)) {
      return next(new AppError(`You don't have permission to ${permission}`, 403));
    }

    next();
  };
};

