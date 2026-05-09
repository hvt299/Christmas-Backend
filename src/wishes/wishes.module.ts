import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { Wish, WishSchema } from './schemas/wish.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wish.name, schema: WishSchema }])
  ],
  controllers: [WishesController],
  providers: [WishesService],
})
export class WishesModule {}
