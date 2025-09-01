"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:3002', 'http://localhost:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Range'],
        exposedHeaders: ['Content-Range', 'Accept-Ranges', 'Content-Length'],
    });
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 LMS Platform API running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map