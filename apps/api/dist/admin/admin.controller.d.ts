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
                email: string;
                firstName: string;
                lastName: string;
                role: import("@prisma/client").$Enums.UserRole;
                createdAt: Date;
            }[];
            courses: {
                id: string;
                createdAt: Date;
                title: string;
                isPublished: boolean;
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
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
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
            email: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
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
            userId: string;
            content: string;
            isAccepted: boolean;
            questionId: string;
        })[];
        lesson: {
            id: string;
            title: string;
            section: {
                course: {
                    id: string;
                    title: string;
                };
            };
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        userId: string;
        courseId: string;
        lessonId: string | null;
        content: string;
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
            id: string;
            title: string;
            section: {
                course: {
                    id: string;
                    title: string;
                };
            };
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        lessonId: string;
        content: string;
        timestamp: number | null;
        isPublic: boolean;
    })[]>;
    getLessonActivity(lessonId: string): Promise<({
        progress: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            progress: number;
            duration: number;
            userId: string;
            lessonId: string;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            lessonId: string;
            content: string;
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
                userId: string;
                content: string;
                isAccepted: boolean;
                questionId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            userId: string;
            courseId: string;
            lessonId: string | null;
            content: string;
            isPinned: boolean;
            isAccepted: boolean;
            acceptedAnswerId: string | null;
        })[];
        section: {
            course: {
                id: string;
                title: string;
            };
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        thumbnail: string | null;
        duration: number;
        isPublished: boolean;
        order: number;
        videoUrl: string | null;
        sectionId: string;
        videoKey: string | null;
        subtitles: import("@prisma/client/runtime/library").JsonValue | null;
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
            userId: string;
            content: string;
            isAccepted: boolean;
            questionId: string;
        })[];
        lesson: {
            id: string;
            title: string;
            section: {
                course: {
                    id: string;
                    title: string;
                };
            };
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        userId: string;
        courseId: string;
        lessonId: string | null;
        content: string;
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
            userId: string;
            content: string;
            isAccepted: boolean;
            questionId: string;
        })[];
        lesson: {
            id: string;
            title: string;
            section: {
                course: {
                    id: string;
                    title: string;
                };
            };
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        userId: string;
        courseId: string;
        lessonId: string | null;
        content: string;
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
        userId: string;
        content: string;
        isAccepted: boolean;
        questionId: string;
    }>;
    updateQuestionStatus(questionId: string, body: {
        status: 'pending' | 'answered' | 'closed';
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        userId: string;
        courseId: string;
        lessonId: string | null;
        content: string;
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
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            description: string;
            thumbnail: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            duration: number;
            level: import("@prisma/client").$Enums.CourseLevel;
            language: string;
            instructorId: string;
            isPublished: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
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
            status: import("@prisma/client").$Enums.EnrollStatus;
            id: string;
            createdAt: Date;
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
            email: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
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
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.UserRole;
        updatedAt: Date;
    }>;
    changeUserStatus(id: string, isActive: boolean): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        updatedAt: Date;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            duration: number;
            isPublished: boolean;
            order: number;
            courseId: string;
            totalLessons: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string;
        thumbnail: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        duration: number;
        level: import("@prisma/client").$Enums.CourseLevel;
        language: string;
        instructorId: string;
        isPublished: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
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
                id: string;
                title: string;
                description: string | null;
                thumbnail: string | null;
                duration: number;
                isPublished: boolean;
                order: number;
                videoUrl: string | null;
                isFree: boolean;
                resources: import("@prisma/client/runtime/library").JsonValue;
                videoType: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            duration: number;
            isPublished: boolean;
            order: number;
            courseId: string;
            totalLessons: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string;
        thumbnail: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        duration: number;
        level: import("@prisma/client").$Enums.CourseLevel;
        language: string;
        instructorId: string;
        isPublished: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
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
                    id: string;
                    title: string;
                    description: string | null;
                    duration: number;
                    isPublished: boolean;
                    order: number;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string | null;
                duration: number;
                isPublished: boolean;
                order: number;
                courseId: string;
                totalLessons: number;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            description: string;
            thumbnail: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            duration: number;
            level: import("@prisma/client").$Enums.CourseLevel;
            language: string;
            instructorId: string;
            isPublished: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
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
                id: string;
                title: string;
                description: string | null;
                duration: number;
                isPublished: boolean;
                order: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            duration: number;
            isPublished: boolean;
            order: number;
            courseId: string;
            totalLessons: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string;
        thumbnail: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        duration: number;
        level: import("@prisma/client").$Enums.CourseLevel;
        language: string;
        instructorId: string;
        isPublished: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        keywords: string | null;
    }>;
    toggleCourseStatus(id: string, isPublished: boolean): Promise<{
        id: string;
        updatedAt: Date;
        title: string;
        isPublished: boolean;
    }>;
    approveCourse(id: string): Promise<{
        instructor: {
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string;
        thumbnail: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        duration: number;
        level: import("@prisma/client").$Enums.CourseLevel;
        language: string;
        instructorId: string;
        isPublished: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        description: string;
        thumbnail: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        duration: number;
        level: import("@prisma/client").$Enums.CourseLevel;
        language: string;
        instructorId: string;
        isPublished: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        keywords: string | null;
    }>;
    deleteCourse(id: string): Promise<{
        message: string;
    }>;
    createSection(courseId: string, createSectionDto: any): Promise<{
        lessons: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            thumbnail: string | null;
            duration: number;
            isPublished: boolean;
            order: number;
            videoUrl: string | null;
            sectionId: string;
            videoKey: string | null;
            subtitles: import("@prisma/client/runtime/library").JsonValue | null;
            isFree: boolean;
            resources: import("@prisma/client/runtime/library").JsonValue | null;
            videoType: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        duration: number;
        isPublished: boolean;
        order: number;
        courseId: string;
        totalLessons: number;
    }>;
    updateSection(id: string, updateSectionDto: any): Promise<{
        lessons: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            thumbnail: string | null;
            duration: number;
            isPublished: boolean;
            order: number;
            videoUrl: string | null;
            sectionId: string;
            videoKey: string | null;
            subtitles: import("@prisma/client/runtime/library").JsonValue | null;
            isFree: boolean;
            resources: import("@prisma/client/runtime/library").JsonValue | null;
            videoType: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        duration: number;
        isPublished: boolean;
        order: number;
        courseId: string;
        totalLessons: number;
    }>;
    deleteSection(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        duration: number;
        isPublished: boolean;
        order: number;
        courseId: string;
        totalLessons: number;
    }>;
    createLesson(sectionId: string, createLessonDto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        thumbnail: string | null;
        duration: number;
        isPublished: boolean;
        order: number;
        videoUrl: string | null;
        sectionId: string;
        videoKey: string | null;
        subtitles: import("@prisma/client/runtime/library").JsonValue | null;
        isFree: boolean;
        resources: import("@prisma/client/runtime/library").JsonValue | null;
        videoType: string | null;
    }>;
    updateLesson(id: string, updateLessonDto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        thumbnail: string | null;
        duration: number;
        isPublished: boolean;
        order: number;
        videoUrl: string | null;
        sectionId: string;
        videoKey: string | null;
        subtitles: import("@prisma/client/runtime/library").JsonValue | null;
        isFree: boolean;
        resources: import("@prisma/client/runtime/library").JsonValue | null;
        videoType: string | null;
    }>;
    deleteLesson(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        thumbnail: string | null;
        duration: number;
        isPublished: boolean;
        order: number;
        videoUrl: string | null;
        sectionId: string;
        videoKey: string | null;
        subtitles: import("@prisma/client/runtime/library").JsonValue | null;
        isFree: boolean;
        resources: import("@prisma/client/runtime/library").JsonValue | null;
        videoType: string | null;
    }>;
    createQnA(courseId: string, createQnADto: any): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            password: string;
            role: import("@prisma/client").$Enums.UserRole;
            isActive: boolean;
            emailVerified: boolean;
            emailVerifiedAt: Date | null;
            avatar: string | null;
            phone: string | null;
            bio: string | null;
            website: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        userId: string;
        courseId: string;
        lessonId: string | null;
        content: string;
        isPinned: boolean;
        isAccepted: boolean;
        acceptedAnswerId: string | null;
    }>;
    updateQnA(id: string, updateQnADto: any): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            password: string;
            role: import("@prisma/client").$Enums.UserRole;
            isActive: boolean;
            emailVerified: boolean;
            emailVerifiedAt: Date | null;
            avatar: string | null;
            phone: string | null;
            bio: string | null;
            website: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        userId: string;
        courseId: string;
        lessonId: string | null;
        content: string;
        isPinned: boolean;
        isAccepted: boolean;
        acceptedAnswerId: string | null;
    }>;
    deleteQnA(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        userId: string;
        courseId: string;
        lessonId: string | null;
        content: string;
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
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
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
