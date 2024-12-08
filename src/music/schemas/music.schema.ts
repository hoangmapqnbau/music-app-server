import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Music extends Document {
  @Prop({ required: true })
  songName: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  gerne: string;

  @Prop({ required: false })
  image: string;

  @Prop({ required: false })
  artist: string;

  @Prop({ default: Date.now })
  uploadedAt: Date;
}

export const MusicSchema = SchemaFactory.createForClass(Music);
