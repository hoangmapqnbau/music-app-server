import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { Music, MusicSchema } from './schemas/music.schema';
import { HistoryPlayed, HistoryPlayedSchema } from './schemas/play-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Music.name, schema: MusicSchema }]),
    MongooseModule.forFeature([{ name: HistoryPlayed.name, schema: HistoryPlayedSchema }]),
  ],
  controllers: [MusicController],
  providers: [MusicService],
  exports: [MusicModule],
})
export class MusicModule {}
