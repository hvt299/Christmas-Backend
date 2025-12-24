import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // <--- QUAN TRỌNG: Biến module này thành toàn cầu
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <--- Xuất khẩu Service để nơi khác dùng được
})
export class PrismaModule {}