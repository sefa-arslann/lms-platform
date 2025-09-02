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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const reports_service_1 = require("../reports/reports.service");
const client_1 = require("@prisma/client");
let AdminController = class AdminController {
    adminService;
    reportsService;
    constructor(adminService, reportsService) {
        this.adminService = adminService;
        this.reportsService = reportsService;
    }
    async getDashboardStats() {
        return this.adminService.getDashboardStats();
    }
    async test() {
        return { message: 'Admin test endpoint working!', timestamp: new Date() };
    }
    async updateDeviceStatus(deviceId, body) {
        return this.adminService.updateDeviceStatus(deviceId, body);
    }
    async deleteDevice(deviceId) {
        return this.adminService.deleteDevice(deviceId);
    }
    async getUserDevices() {
        try {
            return await this.adminService.getUserDevices();
        }
        catch (error) {
            console.error('Controller error:', error);
            return { devices: [] };
        }
    }
    async getUserManagementStats() {
        return this.adminService.getUserManagementStats();
    }
    async getUserActivities(period = 'today') {
        return this.reportsService.getUserActivities(period);
    }
    async getDailyStats(period = 'today') {
        return this.reportsService.getDailyStats(period);
    }
    async getWeeklyStats(period = 'today') {
        return this.reportsService.getWeeklyStats(period);
    }
    async getDetailedQuestions(period = 'today') {
        return this.reportsService.getDetailedQuestions(period);
    }
    async getDetailedNotes(period = 'today') {
        return this.reportsService.getDetailedNotes(period);
    }
    async getLessonActivity(lessonId) {
        return this.reportsService.getLessonActivity(lessonId);
    }
    async getAllQuestions(status = 'all') {
        return this.adminService.getAllQuestions(status);
    }
    async getQuestionDetails(questionId) {
        return this.adminService.getQuestionDetails(questionId);
    }
    async answerQuestion(questionId, body) {
        return this.adminService.answerQuestion(questionId, body.content);
    }
    async updateQuestionStatus(questionId, body) {
        return this.adminService.updateQuestionStatus(questionId, body.status);
    }
    async deleteQuestion(questionId) {
        return this.adminService.deleteQuestion(questionId);
    }
    async deleteNote(noteId) {
        return this.adminService.deleteNote(noteId);
    }
    async deleteMessage(messageId) {
        return this.adminService.deleteMessage(messageId);
    }
    async deleteAnswer(answerId) {
        return this.adminService.deleteAnswer(answerId);
    }
    async getAllOrders() {
        return this.adminService.getAllOrders();
    }
    async updateOrderStatus(orderId, body) {
        return this.adminService.updateOrderStatus(orderId, body.status);
    }
    async getCourseManagementStats() {
        return this.adminService.getCourseManagementStats();
    }
    async getDeviceManagementStats() {
        return this.adminService.getDeviceManagementStats();
    }
    async getUsers(page = 1, limit = 20, role, search) {
        const skip = (page - 1) * limit;
        const where = {};
        if (role)
            where.role = role;
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [users, total] = await Promise.all([
            this.adminService['prisma'].user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            this.adminService['prisma'].user.count({ where }),
        ]);
        return {
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async changeUserRole(id, role) {
        return this.adminService['prisma'].user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                updatedAt: true,
            },
        });
    }
    async changeUserStatus(id, isActive) {
        return this.adminService['prisma'].user.update({
            where: { id },
            data: { isActive },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                isActive: true,
                updatedAt: true,
            },
        });
    }
    async getPendingCourses() {
        return this.adminService['prisma'].course.findMany({
            where: { isPublished: false },
            include: {
                instructor: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                sections: {
                    include: {
                        lessons: {
                            select: { id: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getCourseById(id) {
        try {
            const course = await this.adminService['prisma'].course.findUnique({
                where: { id },
                include: {
                    instructor: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    sections: {
                        include: {
                            lessons: {
                                select: {
                                    id: true,
                                    title: true,
                                    description: true,
                                    duration: true,
                                    order: true,
                                    isPublished: true,
                                    videoUrl: true,
                                    thumbnail: true,
                                    videoType: true,
                                    isFree: true,
                                    resources: true,
                                },
                            },
                        },
                        orderBy: { order: 'asc' },
                    },
                },
            });
            if (!course) {
                throw new Error('Course not found');
            }
            return course;
        }
        catch (error) {
            console.error('Controller error:', error);
            throw error;
        }
    }
    async getCourses(page = 1, limit = 20, status = 'all', level, category, search) {
        const skip = (page - 1) * limit;
        const where = {};
        if (status === 'published')
            where.isPublished = true;
        else if (status === 'draft')
            where.isPublished = false;
        if (level)
            where.level = level;
        if (category)
            where.category = category;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { shortDescription: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [courses, total] = await Promise.all([
            this.adminService['prisma'].course.findMany({
                where,
                skip,
                take: limit,
                include: {
                    instructor: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    sections: {
                        include: {
                            lessons: {
                                select: {
                                    id: true,
                                    title: true,
                                    description: true,
                                    duration: true,
                                    order: true,
                                    isPublished: true,
                                },
                            },
                        },
                    },
                    _count: {
                        select: {
                            sections: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.adminService['prisma'].course.count({ where }),
        ]);
        return {
            courses,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async updateCourse(id, updateData) {
        return this.adminService['prisma'].course.update({
            where: { id },
            data: updateData,
            include: {
                instructor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                sections: {
                    include: {
                        lessons: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                duration: true,
                                order: true,
                                isPublished: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async toggleCourseStatus(id, isPublished) {
        return this.adminService['prisma'].course.update({
            where: { id },
            data: { isPublished },
            select: {
                id: true,
                title: true,
                isPublished: true,
                updatedAt: true,
            },
        });
    }
    async approveCourse(id) {
        return this.adminService['prisma'].course.update({
            where: { id },
            data: { isPublished: true },
            include: {
                instructor: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
    }
    async createCourse(createCourseDto) {
        try {
            return await this.adminService.createCourse(createCourseDto);
        }
        catch (error) {
            console.error('Controller error:', error);
            throw error;
        }
    }
    async deleteCourse(id) {
        try {
            return await this.adminService.deleteCourse(id);
        }
        catch (error) {
            console.error('Controller error:', error);
            throw error;
        }
    }
    async createSection(courseId, createSectionDto) {
        return this.adminService['prisma'].section.create({
            data: {
                ...createSectionDto,
                courseId,
            },
            include: {
                lessons: true,
            },
        });
    }
    async updateSection(id, updateSectionDto) {
        return this.adminService['prisma'].section.update({
            where: { id },
            data: updateSectionDto,
            include: {
                lessons: true,
            },
        });
    }
    async deleteSection(id) {
        return this.adminService['prisma'].section.delete({
            where: { id },
        });
    }
    async createLesson(sectionId, createLessonDto) {
        return this.adminService['prisma'].lesson.create({
            data: {
                ...createLessonDto,
                sectionId,
            },
        });
    }
    async updateLesson(id, updateLessonDto) {
        return this.adminService['prisma'].lesson.update({
            where: { id },
            data: updateLessonDto,
        });
    }
    async deleteLesson(id) {
        return this.adminService['prisma'].lesson.delete({
            where: { id },
        });
    }
    async createQnA(courseId, createQnADto) {
        return this.adminService['prisma'].question.create({
            data: {
                userId: createQnADto.askedBy.id,
                courseId,
                title: createQnADto.question,
                content: createQnADto.question,
            },
            include: {
                user: true,
            },
        });
    }
    async updateQnA(id, updateQnADto) {
        return this.adminService['prisma'].question.update({
            where: { id },
            data: {
                title: updateQnADto.question,
                content: updateQnADto.question,
            },
            include: {
                user: true,
            },
        });
    }
    async deleteQnA(id) {
        return this.adminService['prisma'].question.delete({
            where: { id },
        });
    }
    async getDeviceRequests() {
        try {
            console.log('Controller: Getting device requests...');
            const result = await this.adminService.getDeviceRequests();
            console.log('Controller: Result:', result);
            return result;
        }
        catch (error) {
            console.error('Controller error:', error);
            throw error;
        }
    }
    async approveDeviceRequest(id, body) {
        return this.adminService.approveDeviceRequest(id, body);
    }
    async denyDeviceRequest(id) {
        return this.adminService.denyDeviceRequest(id);
    }
    async getDevicesForUser(userId) {
        try {
            return await this.adminService.getUserDevicesByUserId(userId);
        }
        catch (error) {
            console.error('Controller error:', error);
            throw error;
        }
    }
    async calculateCourseDuration(courseId) {
        try {
            return await this.adminService.calculateCourseDuration(courseId);
        }
        catch (error) {
            console.error('Controller error:', error);
            throw error;
        }
    }
    async getTaxSettings() {
        try {
            const [taxRate, defaultTaxIncluded] = await Promise.all([
                this.adminService.getTaxRate(),
                this.adminService.getDefaultTaxIncluded(),
            ]);
            return {
                taxRate,
                defaultTaxIncluded,
            };
        }
        catch (error) {
            console.error('Controller error:', error);
            throw error;
        }
    }
    async calculatePriceWithTax(body) {
        try {
            return await this.adminService.calculatePriceWithTax(body.price, body.taxIncluded);
        }
        catch (error) {
            console.error('Controller error:', error);
            throw error;
        }
    }
    async getVideoDuration(body) {
        try {
            const durationData = await this.adminService.getVideoDuration(body.videoUrl);
            console.log('Duration data received:', durationData);
            const response = {
                duration: durationData.durationInSeconds,
                durationInSeconds: durationData.durationInSeconds,
                durationInMinutes: Math.round(durationData.durationInSeconds / 60 * 100) / 100,
                formattedDuration: durationData.formattedDuration,
                videoUrl: body.videoUrl
            };
            console.log('Response being sent:', response);
            return response;
        }
        catch (error) {
            console.error('Controller error:', error);
            throw error;
        }
    }
    async getVideoMetadata(body) {
        try {
            const metadata = await this.adminService.getVideoMetadata(body.videoUrl);
            return { ...metadata, videoUrl: body.videoUrl };
        }
        catch (error) {
            console.error('Controller error:', error);
            throw error;
        }
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get admin dashboard statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Dashboard statistics retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Admin access required',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('test'),
    (0, swagger_1.ApiOperation)({ summary: 'Test endpoint' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "test", null);
__decorate([
    (0, common_1.Patch)('devices/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update device status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Device status updated successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateDeviceStatus", null);
__decorate([
    (0, common_1.Delete)('devices/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete device' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Device deleted successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteDevice", null);
__decorate([
    (0, common_1.Get)('devices'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all user devices' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User devices retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserDevices", null);
__decorate([
    (0, common_1.Get)('users/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user management statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User statistics retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserManagementStats", null);
__decorate([
    (0, common_1.Get)('reports/user-activities'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user activities report' }),
    (0, swagger_1.ApiQuery)({ name: 'period', enum: ['today', 'week', 'month'], description: 'Report period' }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserActivities", null);
__decorate([
    (0, common_1.Get)('reports/daily-stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get daily statistics report' }),
    (0, swagger_1.ApiQuery)({ name: 'period', enum: ['today', 'week', 'month'], description: 'Report period' }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDailyStats", null);
__decorate([
    (0, common_1.Get)('reports/weekly-stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get weekly statistics report' }),
    (0, swagger_1.ApiQuery)({ name: 'period', enum: ['today', 'week', 'month'], description: 'Report period' }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getWeeklyStats", null);
__decorate([
    (0, common_1.Get)('reports/detailed-questions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed questions report' }),
    (0, swagger_1.ApiQuery)({ name: 'period', enum: ['today', 'week', 'month'], description: 'Report period' }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDetailedQuestions", null);
__decorate([
    (0, common_1.Get)('reports/detailed-notes'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed notes report' }),
    (0, swagger_1.ApiQuery)({ name: 'period', enum: ['today', 'week', 'month'], description: 'Report period' }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDetailedNotes", null);
__decorate([
    (0, common_1.Get)('reports/lesson-activity/:lessonId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get lesson activity report' }),
    __param(0, (0, common_1.Param)('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getLessonActivity", null);
__decorate([
    (0, common_1.Get)('questions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all questions for admin' }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: ['all', 'unanswered', 'answered'], description: 'Question status filter' }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllQuestions", null);
__decorate([
    (0, common_1.Get)('questions/:questionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get question details' }),
    __param(0, (0, common_1.Param)('questionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getQuestionDetails", null);
__decorate([
    (0, common_1.Post)('questions/:questionId/answer'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin answer to question' }),
    __param(0, (0, common_1.Param)('questionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "answerQuestion", null);
__decorate([
    (0, common_1.Patch)('questions/:questionId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update question status' }),
    __param(0, (0, common_1.Param)('questionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateQuestionStatus", null);
__decorate([
    (0, common_1.Delete)('questions/:questionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete question and all answers' }),
    __param(0, (0, common_1.Param)('questionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteQuestion", null);
__decorate([
    (0, common_1.Delete)('notes/:noteId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete note' }),
    __param(0, (0, common_1.Param)('noteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteNote", null);
__decorate([
    (0, common_1.Delete)('messages/:messageId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete message and all replies' }),
    __param(0, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteMessage", null);
__decorate([
    (0, common_1.Delete)('answers/:answerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete specific answer' }),
    __param(0, (0, common_1.Param)('answerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteAnswer", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders for admin' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Orders retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllOrders", null);
__decorate([
    (0, common_1.Patch)('orders/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update order status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Order status updated successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Get)('courses/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get course management statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Course statistics retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCourseManagementStats", null);
__decorate([
    (0, common_1.Get)('devices/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get device management statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Device statistics retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDeviceManagementStats", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users with pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'role', required: false, enum: client_1.UserRole }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Users retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('role')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Patch)('users/:id/role'),
    (0, swagger_1.ApiOperation)({ summary: 'Change user role' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User role updated successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "changeUserRole", null);
__decorate([
    (0, common_1.Patch)('users/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Change user status (active/inactive)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User status updated successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "changeUserStatus", null);
__decorate([
    (0, common_1.Get)('courses/pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending course approvals' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Pending courses retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPendingCourses", null);
__decorate([
    (0, common_1.Get)('courses/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get course by ID with full details' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Course retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCourseById", null);
__decorate([
    (0, common_1.Get)('courses'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all courses with pagination and filters' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['all', 'published', 'draft'] }),
    (0, swagger_1.ApiQuery)({ name: 'level', required: false, enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Courses retrieved successfully',
    }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('level')),
    __param(4, (0, common_1.Query)('category')),
    __param(5, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCourses", null);
__decorate([
    (0, common_1.Patch)('courses/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update course details' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Course updated successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateCourse", null);
__decorate([
    (0, common_1.Patch)('courses/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle course publish status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Course publish status updated successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('isPublished')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "toggleCourseStatus", null);
__decorate([
    (0, common_1.Patch)('courses/:id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve course for publishing' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Course approved successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveCourse", null);
__decorate([
    (0, common_1.Post)('courses'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new course' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Course created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createCourse", null);
__decorate([
    (0, common_1.Delete)('courses/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a course' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Course deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteCourse", null);
__decorate([
    (0, common_1.Post)('courses/:courseId/sections'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new section for a course' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Section created successfully' }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createSection", null);
__decorate([
    (0, common_1.Patch)('sections/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update section details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Section updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateSection", null);
__decorate([
    (0, common_1.Delete)('sections/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a section' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Section deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteSection", null);
__decorate([
    (0, common_1.Post)('sections/:sectionId/lessons'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new lesson for a section' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Lesson created successfully' }),
    __param(0, (0, common_1.Param)('sectionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createLesson", null);
__decorate([
    (0, common_1.Patch)('lessons/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update lesson details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lesson updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateLesson", null);
__decorate([
    (0, common_1.Delete)('lessons/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a lesson' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lesson deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteLesson", null);
__decorate([
    (0, common_1.Post)('courses/:courseId/qna'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Q&A for a course' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Q&A created successfully' }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createQnA", null);
__decorate([
    (0, common_1.Patch)('qna/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update Q&A details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Q&A updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateQnA", null);
__decorate([
    (0, common_1.Delete)('qna/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a Q&A' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Q&A deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteQnA", null);
__decorate([
    (0, common_1.Get)('devices/requests'),
    (0, swagger_1.ApiOperation)({ summary: 'Get device enrollment requests' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Device requests retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDeviceRequests", null);
__decorate([
    (0, common_1.Patch)('devices/requests/:id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve device enrollment request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Device request approved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveDeviceRequest", null);
__decorate([
    (0, common_1.Patch)('devices/requests/:id/deny'),
    (0, swagger_1.ApiOperation)({ summary: 'Deny device enrollment request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Device request denied successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "denyDeviceRequest", null);
__decorate([
    (0, common_1.Get)('devices/user/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get devices for specific user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User devices retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDevicesForUser", null);
__decorate([
    (0, common_1.Get)('courses/:courseId/duration'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate course duration from lessons' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Course duration calculated successfully' }),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "calculateCourseDuration", null);
__decorate([
    (0, common_1.Get)('tax/settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tax settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tax settings retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTaxSettings", null);
__decorate([
    (0, common_1.Post)('tax/calculate'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate price with tax' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Price calculated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "calculatePriceWithTax", null);
__decorate([
    (0, common_1.Post)('video/duration'),
    (0, swagger_1.ApiOperation)({ summary: 'Get video duration from URL' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Video duration retrieved successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getVideoDuration", null);
__decorate([
    (0, common_1.Post)('video/metadata'),
    (0, swagger_1.ApiOperation)({ summary: 'Get video metadata from URL' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Video metadata retrieved successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getVideoMetadata", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        reports_service_1.ReportsService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map