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
exports.QuestionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QuestionsService = class QuestionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getQuestionsByLesson(lessonId) {
        try {
            const questions = await this.prisma.question.findMany({
                where: { lessonId },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            role: true,
                        },
                    },
                    answers: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    role: true,
                                },
                            },
                        },
                        orderBy: { createdAt: 'asc' },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
            return questions.map(question => ({
                id: question.id,
                question: question.title,
                answer: question.answers.find(a => a.isAccepted)?.content || null,
                userId: question.userId,
                userName: `${question.user.firstName} ${question.user.lastName}`,
                userRole: question.user.role,
                answeredBy: question.answers.find(a => a.isAccepted)?.user ?
                    `${question.answers.find(a => a.isAccepted)?.user.firstName} ${question.answers.find(a => a.isAccepted)?.user.lastName}` :
                    null,
                answeredByRole: question.answers.find(a => a.isAccepted)?.user?.role || null,
                createdAt: question.createdAt,
                upvotes: 0,
                downvotes: 0,
                isPublic: true,
                attachments: [],
            }));
        }
        catch (error) {
            console.error('Error fetching questions:', error);
            throw error;
        }
    }
    async createQuestion(userId, lessonId, courseId, title, content, file) {
        try {
            let attachmentData = null;
            if (file) {
                attachmentData = {
                    fileName: file.originalname,
                    fileSize: file.size,
                    fileType: file.mimetype,
                };
                content += `\n\n📎 Ek Dosya: ${file.originalname} (${this.formatFileSize(file.size)})`;
            }
            const question = await this.prisma.question.create({
                data: {
                    userId,
                    lessonId,
                    courseId,
                    title,
                    content,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            role: true,
                        },
                    },
                },
            });
            return {
                id: question.id,
                question: question.title,
                answer: null,
                userId: question.userId,
                userName: `${question.user.firstName} ${question.user.lastName}`,
                userRole: question.user.role,
                answeredBy: null,
                answeredByRole: null,
                createdAt: question.createdAt,
                upvotes: 0,
                downvotes: 0,
                isPublic: true,
                attachments: attachmentData ? [attachmentData] : [],
            };
        }
        catch (error) {
            console.error('Error creating question:', error);
            throw error;
        }
    }
    async answerQuestion(questionId, userId, content) {
        try {
            const answer = await this.prisma.answer.create({
                data: {
                    userId,
                    questionId,
                    content,
                    isAccepted: true,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            role: true,
                        },
                    },
                },
            });
            await this.prisma.question.update({
                where: { id: questionId },
                data: {
                    isAccepted: true,
                    acceptedAnswerId: answer.id,
                },
            });
            return answer;
        }
        catch (error) {
            console.error('Error answering question:', error);
            throw error;
        }
    }
    formatFileSize(bytes) {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};
exports.QuestionsService = QuestionsService;
exports.QuestionsService = QuestionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuestionsService);
//# sourceMappingURL=questions.service.js.map