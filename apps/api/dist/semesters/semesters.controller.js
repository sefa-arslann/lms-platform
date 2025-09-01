"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemestersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const semesters_service_1 = require("./semesters.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let SemestersController = class SemestersController {
    semestersService;
    constructor(semestersService) {
        this.semestersService = semestersService;
    }
    getCurrentPeriod() {
        return this.semestersService.getCurrentPeriod();
    }
    getCourseAccessDuration() {
        return this.semestersService.calculateCourseAccessDuration();
    }
};
exports.SemestersController = SemestersController;
__decorate([
    (0, common_1.Get)('current-period'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current education period' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current period retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SemestersController.prototype, "getCurrentPeriod", null);
__decorate([
    (0, common_1.Get)('course-access-duration'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate course access duration' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Course access duration calculated successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SemestersController.prototype, "getCourseAccessDuration", null);
exports.SemestersController = SemestersController = __decorate([
    (0, swagger_1.ApiTags)('semesters'),
    (0, common_1.Controller)('semesters'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [semesters_service_1.SemestersService])
], SemestersController);
//# sourceMappingURL=semesters.controller.js.map