import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GiftDocument = Gift & Document;

@Schema({ timestamps: true, collection: 'xmas_gifts' })
export class Gift {
    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    receiverName: string;

    @Prop({ type: Types.ObjectId, ref: 'User', default: null })
    senderId: Types.ObjectId | null;

    @Prop({ type: Types.ObjectId, ref: 'User', default: null })
    receiverId: Types.ObjectId | null;

    @Prop({ default: false })
    isOpened: boolean;

    @Prop({ default: 'red_box' })
    theme: string;

    @Prop({ default: null })
    musicUrl: string;

    @Prop({ default: null })
    openedAt: Date;
}

export const GiftSchema = SchemaFactory.createForClass(Gift);