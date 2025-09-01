"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const admin_module_1 = require("./admin/admin.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const courses_module_1 = require("./courses/courses.module");
const videos_module_1 = require("./videos/videos.module");
const analytics_module_1 = require("./analytics/analytics.module");
const cms_module_1 = require("./cms/cms.module");
const device_module_1 = require("./devices/device.module");
const websocket_module_1 = require("./websocket/websocket.module");
const health_module_1 = require("./health/health.module");
const video_metadata_module_1 = require("./video-metadata/video-metadata.module");
const orders_module_1 = require("./orders/orders.module");
const semesters_module_1 = require("./semesters/semesters.module");
const access_grants_module_1 = require("./access-grants/access-grants.module");
const lesson_progress_module_1 = require("./lesson-progress/lesson-progress.module");
const notes_module_1 = require("./notes/notes.module");
const messages_module_1 = require("./messages/messages.module");
const questions_module_1 = require("./questions/questions.module");
const prisma_service_1 = require("./prisma/prisma.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            prisma_module_1.PrismaModule,
            admin_module_1.AdminModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            courses_module_1.CoursesModule,
            videos_module_1.VideosModule,
            analytics_module_1.AnalyticsModule,
            cms_module_1.CmsModule,
            device_module_1.DeviceModule,
            websocket_module_1.WebSocketModule,
            health_module_1.HealthModule,
            video_metadata_module_1.VideoMetadataModule,
            orders_module_1.OrdersModule,
            semesters_module_1.SemestersModule,
            access_grants_module_1.AccessGrantsModule,
            lesson_progress_module_1.LessonProgressModule,
            notes_module_1.NotesModule,
            messages_module_1.MessagesModule,
            questions_module_1.QuestionsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, prisma_service_1.PrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map