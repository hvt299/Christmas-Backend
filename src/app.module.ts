import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { GiftsModule } from './gifts/gifts.module';
import { WishesModule } from './wishes/wishes.module';
import { SongsModule } from './songs/songs.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Load biến môi trường .env
    ConfigModule.forRoot({ isGlobal: true }), 

    // DÙNG PRISMA MODULE (Đã kết nối DB)
    PrismaModule, 
    
    // Các module chức năng
    GiftsModule, 
    WishesModule, 
    SongsModule, 
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}