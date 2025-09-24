import { Response } from 'express';
import { ApiResponse } from '../types';

export class ResponseHandler {
  static success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200,
    meta?: any
  ): Response<ApiResponse<T>> {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      meta
    };

    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    data?: any
  ): Response<ApiResponse> {
    const response: ApiResponse = {
      success: false,
      message,
      data
    };

    return res.status(statusCode).json(response);
  }
}