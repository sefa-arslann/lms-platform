import { Module } from '@nestjs/common';
import { VideoMetadataService } from './video-metadata.service';

@Module({
  providers: [VideoMetadataService],
  exports: [VideoMetadataService],
})
export class VideoMetadataModule {}
