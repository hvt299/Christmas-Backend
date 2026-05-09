import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WishDocument = Wish & Document;

@Schema({ timestamps: true })
export class Wish {
    @Prop({ required: true })
    message!: string;

    @Prop({ default: 'star' })
    decorationType!: string;

    @Prop({ type: Types.ObjectId, ref: 'User', default: null })
    userId?: Types.ObjectId | null;
}

export const WishSchema = SchemaFactory.createForClass(Wish);