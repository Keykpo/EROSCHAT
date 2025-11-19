import jwt from 'jsonwebtoken';
import { JWTPayload } from '../middleware/authMiddleware';

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || '15m';
const REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';

export class JWTService {
  static generateAccessToken(userId: string, email: string): string {
    const payload: JWTPayload = {
      userId,
      email,
      type: 'access'
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: ACCESS_EXPIRATION
    });
  }

  static generateRefreshToken(userId: string, email: string): string {
    const payload: JWTPayload = {
      userId,
      email,
      type: 'refresh'
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: REFRESH_EXPIRATION
    });
  }

  static verifyToken(token: string): JWTPayload {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  }

  static generateTokenPair(userId: string, email: string) {
    return {
      accessToken: this.generateAccessToken(userId, email),
      refreshToken: this.generateRefreshToken(userId, email)
    };
  }
}
