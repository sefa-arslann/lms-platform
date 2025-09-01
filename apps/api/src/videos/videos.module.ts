import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { VideoProcessingService } from './video-processing.service';
import { S3Service } from './s3.service';
import { SecureVideoController } from './secure-video.controller';
import { SecureVideoService } from './secure-video.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessGrantsModule } from '../access-grants/access-grants.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    PrismaModule,
    AccessGrantsModule,
    JwtModule.register({
      secret: process.env.VIDEO_SECRET_KEY || process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/temp',
        filename: (req, file, cb) => {
          const uniqueName = uuidv4();
          const extension = extname(file.originalname);
          cb(null, `${uniqueName}${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
          cb(null, true);
        } else {
          cb(new Error('Only video files are allowed'), false);
        }
      },
      limits: {
        fileSize: 1024 * 1024 * 500, // 500MB limit
      },
    }),
  ],
  controllers: [VideosController, SecureVideoController],
  providers: [VideosService, VideoProcessingService, S3Service, SecureVideoService],
  exports: [VideosService, VideoProcessingService, S3Service, SecureVideoService],
})
export class VideosModule {}
