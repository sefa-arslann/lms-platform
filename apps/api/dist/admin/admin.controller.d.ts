import { AdminService } from './admin.service';
import { ReportsService } from '../reports/reports.service';
import { UserRole } from '@prisma/client';
export declare class AdminController {
    private readonly adminService;
    private readonly reportsService;
    constructor(adminService: AdminService, reportsService: ReportsService);
    getDashboardStats(): unknown;
    test(): unknown;
    updateDeviceStatus(deviceId: string, body: {
        isActive: boolean;
        isTrusted?: boolean;
    }): unknown;
    deleteDevice(deviceId: string): unknown;
    getUserDevices(): unknown;
    getUserManagementStats(): unknown;
    getUserActivities(period?: 'today' | 'week' | 'month'): unknown;
    getDailyStats(period?: 'today' | 'week' | 'month'): unknown;
    getWeeklyStats(period?: 'today' | 'week' | 'month'): unknown;
    getDetailedQuestions(period?: 'today' | 'week' | 'month'): unknown;
    getDetailedNotes(period?: 'today' | 'week' | 'month'): unknown;
    getLessonActivity(lessonId: string): unknown;
    getAllQuestions(status?: 'all' | 'unanswered' | 'answered'): unknown;
    getQuestionDetails(questionId: string): unknown;
    answerQuestion(questionId: string, body: {
        content: string;
    }): unknown;
    updateQuestionStatus(questionId: string, body: {
        status: 'pending' | 'answered' | 'closed';
    }): unknown;
    deleteQuestion(questionId: string): unknown;
    deleteNote(noteId: string): unknown;
    deleteMessage(messageId: string): unknown;
    deleteAnswer(answerId: string): unknown;
    getAllOrders(): unknown;
    updateOrderStatus(orderId: string, body: {
        status: string;
    }): unknown;
    getCourseManagementStats(): unknown;
    getDeviceManagementStats(): unknown;
    getUsers(page?: number, limit?: number, role?: UserRole, search?: string): unknown;
    changeUserRole(id: string, role: UserRole): unknown;
    changeUserStatus(id: string, isActive: boolean): unknown;
    getPendingCourses(): unknown;
    getCourseById(id: string): unknown;
    getCourses(page?: number, limit?: number, status?: string, level?: string, category?: string, search?: string): unknown;
    updateCourse(id: string, updateData: any): unknown;
    toggleCourseStatus(id: string, isPublished: boolean): unknown;
    approveCourse(id: string): unknown;
    createCourse(createCourseDto: any): unknown;
    deleteCourse(id: string): unknown;
    createSection(courseId: string, createSectionDto: any): unknown;
    updateSection(id: string, updateSectionDto: any): unknown;
    deleteSection(id: string): unknown;
    createLesson(sectionId: string, createLessonDto: any): unknown;
    updateLesson(id: string, updateLessonDto: any): unknown;
    deleteLesson(id: string): unknown;
    createQnA(courseId: string, createQnADto: any): unknown;
    updateQnA(id: string, updateQnADto: any): unknown;
    deleteQnA(id: string): unknown;
    getDeviceRequests(): unknown;
    approveDeviceRequest(id: string, body: {
        deviceName: string;
        isTrusted?: boolean;
    }): unknown;
    denyDeviceRequest(id: string): unknown;
    getDevicesForUser(userId: string): unknown;
    calculateCourseDuration(courseId: string): unknown;
    getTaxSettings(): unknown;
    calculatePriceWithTax(body: {
        price: number;
        taxIncluded: boolean;
    }): unknown;
    getVideoDuration(body: {
        videoUrl: string;
    }): unknown;
    getVideoMetadata(body: {
        videoUrl: string;
    }): unknown;
}
