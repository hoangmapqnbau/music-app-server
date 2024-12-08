import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Music } from './schemas/music.schema';
import { HistoryPlayed } from './schemas/play-history.schema';

@Injectable()
export class MusicService {
  constructor(
    @InjectModel(Music.name) private musicModel: Model<Music>,
    @InjectModel(HistoryPlayed.name) private historyModel: Model<HistoryPlayed>,
  ) {}

  async saveMusic(
    title: string,
    song: Express.Multer.File,
    image: Express.Multer.File,
    artist: string,
  ): Promise<Music> {
    const newMusic = new this.musicModel({
      songName: title,
      fileName: song['filename'],
      image: image['filename'],
      artist,
    });
    return newMusic.save();
  }

  async findAll(paginationQuery = null): Promise<Music[]> {
    if (paginationQuery) {
      const { page = null, limit = null } = paginationQuery;

      if (page && limit) {
        const skip = (page - 1) * limit;
        return this.musicModel.find().skip(skip).limit(limit).exec();
      }
    }

    return this.musicModel.find().exec();
  }

  async findMusicById(musicId): Promise<Music> {
    return this.musicModel.findById(musicId);
  }

  async addUserToHistoryPlayed(userId, songId) {
    const song = await this.musicModel.findById(songId);

    if (!song) {
      throw new Error('User or Song not found');
    }

    const existingHistory = await this.historyModel.findOne({ userId: userId });

    if (existingHistory) {
      const songListeneds = existingHistory.songListeneds;
      const songExist = songListeneds.find((x) => x.songId === songId);

      if (songExist) {
        songExist.listenedAt = new Date();
      } else {
        songListeneds.push({ songId });
      }

      return existingHistory.save();
    } else {
      const newHistory = new this.historyModel({
        userId,
        songListeneds: [{ songId }],
      });
      return newHistory.save();
    }
  }

  async getHistory(userId: string): Promise<Music[]> {
    const historyOfUser = await this.historyModel.findOne({ userId }).exec();
    if (!historyOfUser || !historyOfUser.songListeneds) return [];

    const historySongs = historyOfUser.songListeneds.sort(
      (a, b) =>
        new Date(b.listenedAt).getTime() - new Date(a.listenedAt).getTime(),
    );
    const allSongs = await this.findAll();

    const userHistorySongs: Music[] = historySongs
      .map((hs) => allSongs.find((song) => song._id.toString() === hs.songId))
      .filter(Boolean)
      .slice(0, 10);

    return userHistorySongs;
  }
}
