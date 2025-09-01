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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessGrantsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const access_grants_service_1 = require("./access-grants.service");
let AccessGrantsController = class AccessGrantsController {
    accessGrantsService;
    constructor(accessGrantsService) {
        this.accessGrantsService = accessGrantsService;
    }
    async getMyCourses(req) {
        try {
            console.log(`📚 Fetching courses for user: ${req.user.id}`);
            const courses = await this.accessGrantsService.getUserCourses(req.user.id);
            console.log(`✅ Found ${courses.length} courses for user: ${req.user.id}`);
            return courses;
        }
        catch (error) {
            console.error('❌ Error fetching user courses:', error);
            throw error;
        }
    }
    create(createAccessGrantDto) {
        return this.accessGrantsService.create(createAccessGrantDto);
    }
    findAll() {
        return this.accessGrantsService.findAll();
    }
    findOne(id) {
        return this.accessGrantsService.findOne(id);
    }
};
exports.AccessGrantsController = AccessGrantsController;
__decorate([
    (0, common_1.Get)('my-courses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user enrolled courses with progress' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User courses retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccessGrantsController.prototype, "getMyCourses", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create access grant' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Access grant created successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccessGrantsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all access grants' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Access grants retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AccessGrantsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get access grant by id' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Access grant retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AccessGrantsController.prototype, "findOne", null);
exports.AccessGrantsController = AccessGrantsController = __decorate([
    (0, swagger_1.ApiTags)('access-grants'),
    (0, common_1.Controller)('access-grants'),
    __metadata("design:paramtypes", [access_grants_service_1.AccessGrantsService])
], AccessGrantsController);
//# sourceMappingURL=access-grants.controller.js.map