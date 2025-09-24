import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/appError';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(errorMessage, 400));
    }
    
    req.body = value;
    next();
  };
};
