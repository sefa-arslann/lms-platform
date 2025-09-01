"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessGrantsModule = void 0;
const common_1 = require("@nestjs/common");
const access_grants_controller_1 = require("./access-grants.controller");
const access_grants_service_1 = require("./access-grants.service");
const prisma_module_1 = require("../prisma/prisma.module");
const lesson_progress_module_1 = require("../lesson-progress/lesson-progress.module");
let AccessGrantsModule = class AccessGrantsModule {
};
exports.AccessGrantsModule = AccessGrantsModule;
exports.AccessGrantsModule = AccessGrantsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, lesson_progress_module_1.LessonProgressModule],
        controllers: [access_grants_controller_1.AccessGrantsController],
        providers: [access_grants_service_1.AccessGrantsService],
        exports: [access_grants_service_1.AccessGrantsService],
    })
], AccessGrantsModule);
//# sourceMappingURL=access-grants.module.js.map