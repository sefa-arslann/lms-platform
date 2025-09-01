import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { WebSocketModule } from '../websocket/websocket.module';
import { CmsModule } from '../cms/cms.module';
import { VideoMetadataModule } from '../video-metadata/video-metadata.module';
import { OrdersModule } from '../orders/orders.module';
import { ReportsModule } from '../reports/reports.module';

@Module({
  imports: [PrismaModule, AnalyticsModule, WebSocketModule, CmsModule, VideoMetadataModule, OrdersModule, ReportsModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
