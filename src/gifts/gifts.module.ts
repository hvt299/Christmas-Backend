import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GiftsService } from './gifts.service';
import { GiftsController } from './gifts.controller';
import { Gift, GiftSchema } from './schemas/gift.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Gift.name, schema: GiftSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [GiftsController],
  providers: [GiftsService],
})
export class GiftsModule { }
