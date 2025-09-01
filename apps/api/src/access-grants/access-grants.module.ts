import { Module } from '@nestjs/common';
import { AccessGrantsController } from './access-grants.controller';
import { AccessGrantsService } from './access-grants.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LessonProgressModule } from '../lesson-progress/lesson-progress.module';

@Module({
  imports: [PrismaModule, LessonProgressModule],
  controllers: [AccessGrantsController],
  providers: [AccessGrantsService],
  exports: [AccessGrantsService],
})
export class AccessGrantsModule {}
