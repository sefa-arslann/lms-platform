import { PrismaService } from '../prisma/prisma.service';
import { CmsService } from '../cms/cms.service';
import { VideoMetadataService } from '../video-metadata/video-metadata.service';
import { UserRole } from '@prisma/client';
export declare class AdminService {
    private readonly prisma;
    private readonly cmsService;
    private readonly videoMetadataService;
    private readonly logger;
    constructor(prisma: PrismaService, cmsService: CmsService, videoMetadataService: VideoMetadataService);
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
            totalPages: number;
        };
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
    denyDeviceRequest(requestId: string): Promise<{
        message: string;
    }>;
    getUserDevicesByUserId(userId: string): Promise<{
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
    deleteCourse(courseId: string): Promise<{
        message: string;
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
    getTaxRate(): Promise<number>;
    getDefaultTaxIncluded(): Promise<boolean>;
    calculatePriceWithTax(price: number, taxIncluded?: boolean): Promise<{
        netPrice: number;
        taxAmount: number;
        totalPrice: number;
        taxRate: number;
    }>;
    getVideoDuration(videoUrl: string): Promise<{
        durationInSeconds: number;
        durationInMinutes: number;
        formattedDuration: string;
    }>;
    getVideoMetadata(videoUrl: string): Promise<{
        duration: number;
        width?: number;
        height?: number;
        format?: string;
        bitrate?: number;
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
    approveDeviceRequest(requestId: string, body: {
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
    deleteDevice(deviceId: string): Promise<{
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
    updateOrderStatus(orderId: string, newStatus: string): Promise<{
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
    answerQuestion(questionId: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        isAccepted: boolean;
        questionId: string;
    }>;
    updateQuestionStatus(questionId: string, status: 'pending' | 'answered' | 'closed'): Promise<{
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
}
