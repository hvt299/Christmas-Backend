// src/auth/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = configService.get<string>('SUPABASE_URL');
    
    // Kiểm tra xem đã có URL chưa để tránh lỗi ngớ ngẩn
    if (!supabaseUrl) {
        throw new Error("❌ Thiếu biến SUPABASE_URL trong file .env");
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // THAY ĐỔI LỚN NHẤT Ở ĐÂY 👇
      // Không dùng secretOrKey cứng nữa, mà dùng provider động
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        // Đường dẫn chuẩn để lấy khóa của Supabase
        jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
      }),
      // Chỉ định rõ thuật toán backend chấp nhận
      algorithms: ['ES256', 'RS256'], 
    });
  }

  async validate(payload: any) {
    if (!payload) {
        throw new UnauthorizedException();
    }
    return { userId: payload.sub, email: payload.email };
  }
}