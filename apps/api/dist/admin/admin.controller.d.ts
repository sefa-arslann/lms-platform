import { AdminService } from './admin.service';
import { ReportsService, DailyStats, WeeklyStats } from '../reports/reports.service';
import { UserRole } from '@prisma/client';
export declare class AdminController {
    private readonly adminService;
    private readonly reportsService;
    constructor(adminService: AdminService, reportsService: ReportsService);
    getDashboardStats(): Promise<{
        users: {
            total: number;
            students: number;
            instructors: number;
            admins: number;
        };
        courses: {
            total: number;
            pendingApproval: number;
        };
        revenue: {
            total: number | import("@prisma/client/runtime/library").Decimal;
            currency: string;
        };
        devices: {
            pendingRequests: number;
        };
        analytics: {
            activeUsers: number;
            totalVideoViews: number;
            totalCourseViews: number;
            averageSessionDuration: number;
            todayEvents: number;
            todayUniqueUsers: number;
        };
        recent: {
            users: {
                id: string;
                createdAt: Date;
                email: string;
                firstName: string;
                lastName: string;
                role: import("@prisma/client").$Enums.UserRole;
            }[];
            courses: {
                id: string;
                title: string;
                isPublished: boolean;
                createdAt: Date;
            }[];
            activity: never[];
            courseViews: never[];
            videoActions: never[];
        };
        topCourses: never[];
        reports: {
            totalQuestions: number;
            totalNotes: number;
            unansweredQuestions: number;
            totalMessages: number;
            unreadMessages: number;
        };
    }>;
    test(): Promise<{
        message: string;
        timestamp: Date;
    }>;
    updateDeviceStatus(deviceId: string, body: {
        isActive: boolean;
        isTrusted?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        userId: string;
        installId: string;
        publicKey: string;
        platform: string;
        model: string | null;
        userAgent: string | null;
        firstIp: string;
        lastIp: string;
        lastSeenAt: Date;
        isTrusted: boolean;
        approvedAt: Date | null;
        deviceName: string | null;
        osVersion: string | null;
        appVersion: string | null;
    }>;
    deleteDevice(deviceId: string): Promise<{
        message: string;
    }>;
    getUserDevices(): Promise<{
        devices: {
            id: string;
            userId: string;
            userEmail: string;
            userName: string;
            deviceName: string | null;
            platform: string;
            model: string | null;
            isActive: boolean;
            isTrusted: boolean;
            lastSeenAt: Date;
        }[];
    }>;
    getUserManagementStats(): Promise<{
        byRole: {
            role: import("@prisma/client").$Enums.UserRole;
            count: number;
        }[];
        byStatus: {
            isActive: boolean;
            count: number;
        }[];
        recent: {
            id: string;
            createdAt: Date;
            email: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
        }[];
    }>;
    getUserActivities(period?: 'today' | 'week' | 'month'): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        todayWatched: number;
        todayCompleted: number;
        thisWeekWatched: number;
        thisWeekCompleted: number;
        totalQuestions: number;
        totalNotes: number;
        lastActive: string;
        totalProgress: number;
    }[]>;
    getDailyStats(period?: 'today' | 'week' | 'month'): Promise<DailyStats[]>;
    getWeeklyStats(period?: 'today' | 'week' | 'month'): Promise<WeeklyStats[]>;
    getDetailedQuestions(period?: 'today' | 'week' | 'month'): Promise<({
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        lesson: {
            section: {
                course: {
                    id: string;
                    title: string;
                };
            };
            id: string;
            title: string;
        } | null;
        answers: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            userId: string;
            isAccepted: boolean;
            questionId: string;
        })[];
    } & {
        lessonId: string | null;
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
        courseId: string;
        isPinned: boolean;
        isAccepted: boolean;
        acceptedAnswerId: string | null;
    })[]>;
    getDetailedNotes(period?: 'today' | 'week' | 'month'): Promise<({
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        lesson: {
            section: {
                course: {
                    id: string;
                    title: string;
                };
            };
            id: string;
            title: string;
        };
    } & {
        lessonId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
        timestamp: number | null;
        isPublic: boolean;
    })[]>;
    getLessonActivity(lessonId: string): Promise<({
        section: {
            course: {
                id: string;
                title: string;
            };
        };
        progress: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            lessonId: string;
            id: string;
            duration: number;
            createdAt: Date;
            updatedAt: Date;
            progress: number;
            userId: string;
            completed: boolean;
            lastPosition: number;
            completedAt: Date | null;
        })[];
        notes: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            lessonId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            userId: string;
            timestamp: number | null;
            isPublic: boolean;
        })[];
        questions: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
            answers: ({
                user: {
                    id: string;
                    firstName: string;
                    lastName: string;
                    role: import("@prisma/client").$Enums.UserRole;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                content: string;
                userId: string;
                isAccepted: boolean;
                questionId: string;
            })[];
        } & {
            lessonId: string | null;
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            userId: string;
            courseId: string;
            isPinned: boolean;
            isAccepted: boolean;
            acceptedAnswerId: string | null;
        })[];
    } & {
        order: number;
        id: string;
        title: string;
        description: string | null;
        videoUrl: string | null;
        duration: number;
        sectionId: string;
        isPublished: boolean;
        videoKey: string | null;
        thumbnail: string | null;
        subtitles: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        isFree: boolean;
        resources: import("@prisma/client/runtime/library").JsonValue | null;
        videoType: string | null;
    }) | null>;
    getAllQuestions(status?: 'all' | 'unanswered' | 'answered'): Promise<({
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        lesson: {
            section: {
                course: {
                    id: string;
                    title: string;
                };
            };
            id: string;
            title: string;
        } | null;
        answers: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            userId: string;
            isAccepted: boolean;
            questionId: string;
        })[];
    } & {
        lessonId: string | null;
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
        courseId: string;
        isPinned: boolean;
        isAccepted: boolean;
        acceptedAnswerId: string | null;
    })[]>;
    getQuestionDetails(questionId: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        lesson: {
            section: {
                course: {
                    id: string;
                    title: string;
                };
            };
            id: string;
            title: string;
        } | null;
        answers: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            userId: string;
            isAccepted: boolean;
            questionId: string;
        })[];
    } & {
        lessonId: string | null;
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
        courseId: string;
        isPinned: boolean;
        isAccepted: boolean;
        acceptedAnswerId: string | null;
    }>;
    answerQuestion(questionId: string, body: {
        content: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
        isAccepted: boolean;
        questionId: string;
    }>;
    updateQuestionStatus(questionId: string, body: {
        status: 'pending' | 'answered' | 'closed';
    }): Promise<{
        lessonId: string | null;
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
        courseId: string;
        isPinned: boolean;
        isAccepted: boolean;
        acceptedAnswerId: string | null;
    }>;
    deleteQuestion(questionId: string): Promise<{
        message: string;
    }>;
    deleteNote(noteId: string): Promise<{
        message: string;
    }>;
    deleteMessage(messageId: string): Promise<{
        message: string;
    }>;
    deleteAnswer(answerId: string): Promise<{
        message: string;
    }>;
    getAllOrders(): Promise<{
        id: string;
        courseId: string;
        courseTitle: string;
        userId: string;
        userEmail: string;
        userName: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    updateOrderStatus(orderId: string, body: {
        status: string;
    }): Promise<{
        id: string;
        courseId: string;
        courseTitle: string;
        userId: string;
        userEmail: string;
        userName: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue;
    }>;
    getCourseManagementStats(): Promise<{
        byStatus: {
            isPublished: boolean;
            count: number;
        }[];
        byInstructor: {
            instructor: string;
            count: number;
        }[];
        pendingApprovals: ({
            instructor: {
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            title: string;
            description: string;
            duration: number;
            isPublished: boolean;
            thumbnail: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            level: import("@prisma/client").$Enums.CourseLevel;
            language: string;
            instructorId: string;
            keywords: string | null;
        })[];
    }>;
    getDeviceManagementStats(): Promise<{
        pendingRequests: number;
        statistics: {
            platform: string;
            count: number;
        }[];
        recentActivity: ({
            user: {
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.EnrollStatus;
            userId: string;
            installId: string | null;
            platform: string;
            model: string | null;
            ip: string;
            geoCountry: string | null;
            requestId: string;
            expiresAt: Date;
        })[];
    }>;
    getUsers(page?: number, limit?: number, role?: UserRole, search?: string): Promise<{
        users: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            email: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    changeUserRole(id: string, role: UserRole): Promise<{
        id: string;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    changeUserStatus(id: string, isActive: boolean): Promise<{
        id: string;
        updatedAt: Date;
        isActive: boolean;
        email: string;
        firstName: string;
        lastName: string;
    }>;
    getPendingCourses(): Promise<({
        instructor: {
            email: string;
            firstName: string;
            lastName: string;
        };
        sections: ({
            lessons: {
                id: string;
            }[];
        } & {
            order: number;
            id: string;
            title: string;
            description: string | null;
            duration: number;
            isPublished: boolean;
            createdAt: Date;
            updatedAt: Date;
            courseId: string;
            totalLessons: number;
        })[];
    } & {
        id: string;
        title: string;
        description: string;
        duration: number;
        isPublished: boolean;
        thumbnail: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        level: import("@prisma/client").$Enums.CourseLevel;
        language: string;
        instructorId: string;
        keywords: string | null;
    })[]>;
    getCourseById(id: string): Promise<{
        instructor: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        sections: ({
            lessons: {
                order: number;
                id: string;
                title: string;
                description: string | null;
                videoUrl: string | null;
                duration: number;
                isPublished: boolean;
                thumbnail: string | null;
                isFree: boolean;
                resources: import("@prisma/client/runtime/library").JsonValue;
                videoType: string | null;
            }[];
        } & {
            order: number;
            id: string;
            title: string;
            description: string | null;
            duration: number;
            isPublished: boolean;
            createdAt: Date;
            updatedAt: Date;
            courseId: string;
            totalLessons: number;
        })[];
    } & {
        id: string;
        title: string;
        description: string;
        duration: number;
        isPublished: boolean;
        thumbnail: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        level: import("@prisma/client").$Enums.CourseLevel;
        language: string;
        instructorId: string;
        keywords: string | null;
    }>;
    getCourses(page?: number, limit?: number, status?: string, level?: string, category?: string, search?: string): Promise<{
        courses: ({
            _count: {
                sections: number;
            };
            instructor: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
            sections: ({
                lessons: {
                    order: number;
                    id: string;
                    title: string;
                    description: string | null;
                    duration: number;
                    isPublished: boolean;
                }[];
            } & {
                order: number;
                id: string;
                title: string;
                description: string | null;
                duration: number;
                isPublished: boolean;
                createdAt: Date;
                updatedAt: Date;
                courseId: string;
                totalLessons: number;
            })[];
        } & {
            id: string;
            title: string;
            description: string;
            duration: number;
            isPublished: boolean;
            thumbnail: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            level: import("@prisma/client").$Enums.CourseLevel;
            language: string;
            instructorId: string;
            keywords: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    updateCourse(id: string, updateData: any): Promise<{
        instructor: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        sections: ({
            lessons: {
                order: number;
                id: string;
                title: string;
                description: string | null;
                duration: number;
                isPublished: boolean;
            }[];
        } & {
            order: number;
            id: string;
            title: string;
            description: string | null;
            duration: number;
            isPublished: boolean;
            createdAt: Date;
            updatedAt: Date;
            courseId: string;
            totalLessons: number;
        })[];
    } & {
        id: string;
        title: string;
        description: string;
        duration: number;
        isPublished: boolean;
        thumbnail: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        level: import("@prisma/client").$Enums.CourseLevel;
        language: string;
        instructorId: string;
        keywords: string | null;
    }>;
    toggleCourseStatus(id: string, isPublished: boolean): Promise<{
        id: string;
        title: string;
        isPublished: boolean;
        updatedAt: Date;
    }>;
    approveCourse(id: string): Promise<{
        instructor: {
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        title: string;
        description: string;
        duration: number;
        isPublished: boolean;
        thumbnail: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        level: import("@prisma/client").$Enums.CourseLevel;
        language: string;
        instructorId: string;
        keywords: string | null;
    }>;
    createCourse(createCourseDto: any): Promise<{
        instructor: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        title: string;
        description: string;
        duration: number;
        isPublished: boolean;
        thumbnail: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        level: import("@prisma/client").$Enums.CourseLevel;
        language: string;
        instructorId: string;
        keywords: string | null;
    }>;
    deleteCourse(id: string): Promise<{
        message: string;
    }>;
    createSection(courseId: string, createSectionDto: any): Promise<{
        lessons: {
            order: number;
            id: string;
            title: string;
            description: string | null;
            videoUrl: string | null;
            duration: number;
            sectionId: string;
            isPublished: boolean;
            videoKey: string | null;
            thumbnail: string | null;
            subtitles: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
            isFree: boolean;
            resources: import("@prisma/client/runtime/library").JsonValue | null;
            videoType: string | null;
        }[];
    } & {
        order: number;
        id: string;
        title: string;
        description: string | null;
        duration: number;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        totalLessons: number;
    }>;
    updateSection(id: string, updateSectionDto: any): Promise<{
        lessons: {
            order: number;
            id: string;
            title: string;
            description: string | null;
            videoUrl: string | null;
            duration: number;
            sectionId: string;
            isPublished: boolean;
            videoKey: string | null;
            thumbnail: string | null;
            subtitles: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
            isFree: boolean;
            resources: import("@prisma/client/runtime/library").JsonValue | null;
            videoType: string | null;
        }[];
    } & {
        order: number;
        id: string;
        title: string;
        description: string | null;
        duration: number;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        totalLessons: number;
    }>;
    deleteSection(id: string): Promise<{
        order: number;
        id: string;
        title: string;
        description: string | null;
        duration: number;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        totalLessons: number;
    }>;
    createLesson(sectionId: string, createLessonDto: any): Promise<{
        order: number;
        id: string;
        title: string;
        description: string | null;
        videoUrl: string | null;
        duration: number;
        sectionId: string;
        isPublished: boolean;
        videoKey: string | null;
        thumbnail: string | null;
        subtitles: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        isFree: boolean;
        resources: import("@prisma/client/runtime/library").JsonValue | null;
        videoType: string | null;
    }>;
    updateLesson(id: string, updateLessonDto: any): Promise<{
        order: number;
        id: string;
        title: string;
        description: string | null;
        videoUrl: string | null;
        duration: number;
        sectionId: string;
        isPublished: boolean;
        videoKey: string | null;
        thumbnail: string | null;
        subtitles: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        isFree: boolean;
        resources: import("@prisma/client/runtime/library").JsonValue | null;
        videoType: string | null;
    }>;
    deleteLesson(id: string): Promise<{
        order: number;
        id: string;
        title: string;
        description: string | null;
        videoUrl: string | null;
        duration: number;
        sectionId: string;
        isPublished: boolean;
        videoKey: string | null;
        thumbnail: string | null;
        subtitles: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        isFree: boolean;
        resources: import("@prisma/client/runtime/library").JsonValue | null;
        videoType: string | null;
    }>;
    createQnA(courseId: string, createQnADto: any): Promise<{
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            email: string;
            firstName: string;
            lastName: string;
            password: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            emailVerifiedAt: Date | null;
            avatar: string | null;
            phone: string | null;
            bio: string | null;
            website: string | null;
        };
    } & {
        lessonId: string | null;
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
        courseId: string;
        isPinned: boolean;
        isAccepted: boolean;
        acceptedAnswerId: string | null;
    }>;
    updateQnA(id: string, updateQnADto: any): Promise<{
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            email: string;
            firstName: string;
            lastName: string;
            password: string;
            role: import("@prisma/client").$Enums.UserRole;
            emailVerified: boolean;
            emailVerifiedAt: Date | null;
            avatar: string | null;
            phone: string | null;
            bio: string | null;
            website: string | null;
        };
    } & {
        lessonId: string | null;
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
        courseId: string;
        isPinned: boolean;
        isAccepted: boolean;
        acceptedAnswerId: string | null;
    }>;
    deleteQnA(id: string): Promise<{
        lessonId: string | null;
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
        courseId: string;
        isPinned: boolean;
        isAccepted: boolean;
        acceptedAnswerId: string | null;
    }>;
    getDeviceRequests(): Promise<{
        requests: {
            id: string;
            userId: string;
            userEmail: string;
            userName: string;
            installId: string;
            platform: string;
            model: string;
            status: import("@prisma/client").$Enums.EnrollStatus;
            createdAt: string;
        }[];
    }>;
    approveDeviceRequest(id: string, body: {
        deviceName: string;
        isTrusted?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        userId: string;
        installId: string;
        publicKey: string;
        platform: string;
        model: string | null;
        userAgent: string | null;
        firstIp: string;
        lastIp: string;
        lastSeenAt: Date;
        isTrusted: boolean;
        approvedAt: Date | null;
        deviceName: string | null;
        osVersion: string | null;
        appVersion: string | null;
    }>;
    denyDeviceRequest(id: string): Promise<{
        message: string;
    }>;
    getDevicesForUser(userId: string): Promise<{
        devices: {
            id: string;
            deviceName: string;
            platform: string;
            model: string | null;
            userAgent: string;
            lastUsedAt: string;
            isActive: boolean;
        }[];
    }>;
    calculateCourseDuration(courseId: string): Promise<{
        courseId: string;
        totalDuration: number;
        totalLessons: number;
        lessonsWithVideo: number;
        averageLessonDuration: number;
        durationInMinutes: number;
        durationInHours: number;
        durationInMinutesRemaining: number;
    }>;
    getTaxSettings(): Promise<{
        taxRate: number;
        defaultTaxIncluded: boolean;
    }>;
    calculatePriceWithTax(body: {
        price: number;
        taxIncluded: boolean;
    }): Promise<{
        netPrice: number;
        taxAmount: number;
        totalPrice: number;
        taxRate: number;
    }>;
    getVideoDuration(body: {
        videoUrl: string;
    }): Promise<{
        duration: number;
        durationInSeconds: number;
        durationInMinutes: number;
        formattedDuration: string;
        videoUrl: string;
    }>;
    getVideoMetadata(body: {
        videoUrl: string;
    }): Promise<{
        videoUrl: string;
        duration: number;
        width?: number;
        height?: number;
        format?: string;
        bitrate?: number;
    }>;
}
