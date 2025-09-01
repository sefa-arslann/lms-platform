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
    getDashboardStats(): unknown;
    getUserManagementStats(): unknown;
    getCourseManagementStats(): unknown;
    getDeviceManagementStats(): unknown;
    getUsers(page?: number, limit?: number, role?: UserRole, search?: string): unknown;
    getDeviceRequests(): unknown;
    getUserDevices(): unknown;
    denyDeviceRequest(requestId: string): unknown;
    getUserDevicesByUserId(userId: string): unknown;
    createCourse(createCourseDto: any): unknown;
    deleteCourse(courseId: string): unknown;
    calculateCourseDuration(courseId: string): unknown;
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
    }): unknown;
    approveDeviceRequest(requestId: string, body: {
        deviceName: string;
        isTrusted?: boolean;
    }): unknown;
    deleteDevice(deviceId: string): unknown;
    getAllOrders(): unknown;
    updateOrderStatus(orderId: string, newStatus: string): unknown;
    getAllQuestions(status?: 'all' | 'unanswered' | 'answered'): unknown;
    getQuestionDetails(questionId: string): unknown;
    answerQuestion(questionId: string, content: string): unknown;
    updateQuestionStatus(questionId: string, status: 'pending' | 'answered' | 'closed'): unknown;
    deleteQuestion(questionId: string): unknown;
    deleteNote(noteId: string): unknown;
    deleteMessage(messageId: string): unknown;
    deleteAnswer(answerId: string): unknown;
}
