import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dns from 'dns';
import { ValidationPipe } from '@nestjs/common';

// Fix lỗi kết nối trên Node 17+
dns.setDefaultResultOrder('ipv4first');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cấu hình CORS linh hoạt (Hybrid)
  app.enableCors({
    origin: [
      'http://localhost:3000',                        // Cho phép Frontend Local (Next.js chạy máy nhà)
      'http://localhost:3001',                        // Cho phép chính nó (nếu test API bằng trình duyệt)
      'https://christmas-backend-vida.onrender.com',  // Cho phép chính domain Render (để test swagger/api)
      'https://christmas-frontend-eta.vercel.app',   // Sau khi bạn deploy Frontend lên Vercel
    ],
    credentials: true,
  });

  // Kích hoạt Validation (kiểm tra dữ liệu đầu vào)
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();