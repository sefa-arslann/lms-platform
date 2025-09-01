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
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CoursesService = class CoursesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCourseDto, instructorId) {
        return this.prisma.course.create({
            data: {
                ...createCourseDto,
                instructorId,
            },
            include: {
                instructor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
    }
    async findAll(role, userId) {
        if (role === client_1.UserRole.STUDENT) {
            return this.prisma.course.findMany({
                where: { isPublished: true },
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
                        where: { isPublished: true },
                        orderBy: { order: 'asc' },
                        include: {
                            lessons: {
                                where: { isPublished: true },
                                orderBy: { order: 'asc' },
                            },
                        },
                    },
                },
            });
        }
        if (role === client_1.UserRole.INSTRUCTOR && userId) {
            return this.prisma.course.findMany({
                where: { instructorId: userId },
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
                        orderBy: { order: 'asc' },
                        include: {
                            lessons: {
                                orderBy: { order: 'asc' },
                            },
                        },
                    },
                },
            });
        }
        return this.prisma.course.findMany({
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
                    orderBy: { order: 'asc' },
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' },
                        },
                    },
                },
            },
        });
    }
    async findBySlug(slug, role, userId) {
        const course = await this.prisma.course.findFirst({
            where: { slug },
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
                    orderBy: { order: 'asc' },
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' },
                        },
                    },
                },
            },
        });
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        if (role === client_1.UserRole.STUDENT && !course.isPublished) {
            throw new common_1.ForbiddenException('Course not available');
        }
        if (role === client_1.UserRole.INSTRUCTOR && course.instructorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return course;
    }
    async findOne(id, role, userId) {
        const course = await this.prisma.course.findUnique({
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
                    orderBy: { order: 'asc' },
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' },
                        },
                    },
                },
            },
        });
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        if (role === client_1.UserRole.STUDENT && !course.isPublished) {
            throw new common_1.ForbiddenException('Course not available');
        }
        if (role === client_1.UserRole.INSTRUCTOR && course.instructorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return course;
    }
    async update(id, updateCourseDto, userId, role) {
        const course = await this.findOne(id, role, userId);
        if (role === client_1.UserRole.INSTRUCTOR && course.instructorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.course.update({
            where: { id },
            data: updateCourseDto,
            include: {
                instructor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
    }
    async remove(id, userId, role) {
        const course = await this.findOne(id, role, userId);
        if (role === client_1.UserRole.INSTRUCTOR && course.instructorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.course.update({
            where: { id },
            data: { isPublished: false },
        });
    }
    async publish(id, userId, role) {
        const course = await this.findOne(id, role, userId);
        if (role === client_1.UserRole.INSTRUCTOR && course.instructorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.course.update({
            where: { id },
            data: { isPublished: true },
        });
    }
    async unpublish(id, userId, role) {
        const course = await this.findOne(id, role, userId);
        if (role === client_1.UserRole.INSTRUCTOR && course.instructorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.course.update({
            where: { id },
            data: { isPublished: false },
        });
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map