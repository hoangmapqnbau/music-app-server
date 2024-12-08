import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  Param,
  HttpException,
  HttpStatus,
  UploadedFiles,
  Query,
  Req,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
} from '@nestjs/platform-express';

import { MusicService } from './music.service';
import { Music } from './schemas/music.schema';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { PaginationQueryDto } from './schemas/pagination.schema';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get('recent')
  async getRecentlySongs(@Req() req): Promise<Music[]> {
    return this.musicService.getHistory(req.user.userId);
  }

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'music', maxCount: 1 },
        { name: 'image', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, callback) => {
            let uploadPath = '';

            // Xác định thư mục upload dựa trên loại file
            if (file.fieldname === 'music') {
              uploadPath = './uploads/musics';
            } else if (file.fieldname === 'image') {
              uploadPath = './uploads/images';
            }
            callback(null, uploadPath);
          },
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const fileExtension = extname(file.originalname);
            const fileName = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;
            callback(null, fileName);
          },
        }),
        fileFilter: (req, file, callback) => {
          // Validate file types
          if (file.fieldname === 'music') {
            const allowedMusicTypes = ['.mp3', '.wav', '.ogg'];
            const ext = extname(file.originalname).toLowerCase();
            if (!allowedMusicTypes.includes(ext)) {
              return callback(
                new HttpException(
                  'Invalid music file type',
                  HttpStatus.BAD_REQUEST,
                ),
                false,
              );
            }
          }

          if (file.fieldname === 'image') {
            const allowedImageTypes = ['.jpg', '.jpeg', '.png', '.webp'];
            const ext = extname(file.originalname).toLowerCase();
            if (!allowedImageTypes.includes(ext)) {
              return callback(
                new HttpException(
                  'Invalid image file type',
                  HttpStatus.BAD_REQUEST,
                ),
                false,
              );
            }
          }

          callback(null, true);
        },
      },
    ),
  )
  async uploadMusic(
    @UploadedFiles()
    files: {
      music?: Express.Multer.File[];
      image?: Express.Multer.File[];
    },
    @Body('title') title: string,
    @Body('artist') artist: string,
  ) {
    const song = await this.musicService.saveMusic(
      title,
      files.music[0],
      files.image[0],
      artist,
    );
    return { message: 'Upload successful', song };
  }

  @Get(':musicId')
  async getMusicById(@Param('musicId') musicId: string, @Req() req): Promise<Music> {
    if(musicId == 'undefined') return;

    const userId = req.user.userId;
    this.musicService.addUserToHistoryPlayed(userId, musicId)
    return this.musicService.findMusicById(musicId);
  }

  @Get()
  async getAllMusic(@Query() paginationQuery: PaginationQueryDto = null) {
    return this.musicService.findAll(paginationQuery);
  }
}
