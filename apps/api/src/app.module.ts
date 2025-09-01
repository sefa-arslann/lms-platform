import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { VideosModule } from './videos/videos.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { CmsModule } from './cms/cms.module';
import { DeviceModule } from './devices/device.module';
import { WebSocketModule } from './websocket/websocket.module';
import { HealthModule } from './health/health.module';
import { VideoMetadataModule } from './video-metadata/video-metadata.module';
import { OrdersModule } from './orders/orders.module';
import { SemestersModule } from './semesters/semesters.module';
import { AccessGrantsModule } from './access-grants/access-grants.module';
import { LessonProgressModule } from './lesson-progress/lesson-progress.module';
import { NotesModule } from './notes/notes.module';
import { MessagesModule } from './messages/messages.module';
import { QuestionsModule } from './questions/questions.module';

import { PrismaService } from './prisma/prisma.service';
// import { VideoSecurityMiddleware } from './videos/video-security.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AdminModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    VideosModule,
    AnalyticsModule,
    CmsModule,
    DeviceModule,
    WebSocketModule,
    HealthModule,
    VideoMetadataModule,
    OrdersModule,
    SemestersModule,
    AccessGrantsModule,
    LessonProgressModule,
    NotesModule,
    MessagesModule,
    QuestionsModule,

  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(VideoSecurityMiddleware)
  //     .forRoutes(
  //       { path: 'secure-video/*', method: RequestMethod.ALL },
  //       { path: 'videos/*', method: RequestMethod.ALL }
  //     );
  // }
}
