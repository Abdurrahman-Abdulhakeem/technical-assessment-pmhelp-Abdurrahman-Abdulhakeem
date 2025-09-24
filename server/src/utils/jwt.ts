import jwt, { SignOptions } from 'jsonwebtoken';
import { IUserDocument } from '@/models/User';

export const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET as string,
    {
      expiresIn: (process.env.JWT_EXPIRES_IN as string) || "90d",
    } as SignOptions
  );
};

export const verifyToken = (token: string): { id: string } => {
  return jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
};

export const createSendToken = (user: IUserDocument, statusCode: number, res: any) => {
  const token = generateToken(user._id.toString());
  const cookieOptions = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRES_IN!) || 90) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res.cookie('jwt', token, cookieOptions);

  const userOutput =user.toJSON();;

  return { token, user: userOutput };
};
