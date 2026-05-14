import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SongDocument = Song & Document;

@Schema({ timestamps: true, collection: 'xmas_songs' })
export class Song {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    artist: string;

    @Prop({ required: true })
    url: string;

    @Prop({ default: null })
    coverUrl?: string;

    @Prop({ default: true })
    isActive: boolean;
}

export const SongSchema = SchemaFactory.createForClass(Song);