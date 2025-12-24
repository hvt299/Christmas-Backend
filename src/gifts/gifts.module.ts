import { Module } from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { GiftsController } from './gifts.controller';

@Module({
  controllers: [GiftsController],
  providers: [GiftsService],
})
export class GiftsModule {}
