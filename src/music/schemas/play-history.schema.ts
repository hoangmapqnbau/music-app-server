import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false})
class SongListen {
  @Prop()
  songId: string;

  @Prop({ default: Date.now, isRequired: false })
  listenedAt?: Date;
}

const SongListenSchema = SchemaFactory.createForClass(SongListen);

@Schema()
export class HistoryPlayed extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [SongListenSchema] })
  songListeneds: SongListen[];
}

export const HistoryPlayedSchema = SchemaFactory.createForClass(HistoryPlayed);
