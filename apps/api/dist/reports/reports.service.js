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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserActivities(period) {
        const now = new Date();
        let startDate;
        switch (period) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }
        const users = await this.prisma.user.findMany({
            where: {
                isActive: true,
                role: 'STUDENT'
            },
            include: {
                progress: {
                    where: {
                        updatedAt: {
                            gte: startDate
                        }
                    }
                },
                questions: {
                    where: {
                        createdAt: {
                            gte: startDate
                        }
                    }
                },
                notes: {
                    where: {
                        createdAt: {
                            gte: startDate
                        }
                    }
                },
                userSessions: {
                    where: {
                        lastActivity: {
                            gte: startDate
                        }
                    }
                },
                courseViews: {
                    where: {
                        createdAt: {
                            gte: startDate
                        }
                    }
                }
            }
        });
        const userActivities = await Promise.all(users.map(async (user) => {
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const todayProgress = user.progress.filter(progress => progress.updatedAt >= todayStart);
            const todayWatched = todayProgress.reduce((sum, progress) => {
                const progressPercent = progress.progress || 0;
                const estimatedWatchedSeconds = Math.floor((progressPercent / 100) * 300);
                return sum + estimatedWatchedSeconds;
            }, 0);
            const todayCompleted = todayProgress.filter(progress => (progress.progress || 0) >= 95).length;
            const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const weekProgress = user.progress.filter(progress => progress.updatedAt >= weekStart);
            const thisWeekWatched = weekProgress.reduce((sum, progress) => {
                const progressPercent = progress.progress || 0;
                const estimatedWatchedSeconds = Math.floor((progressPercent / 100) * 300);
                return sum + estimatedWatchedSeconds;
            }, 0);
            const thisWeekCompleted = weekProgress.filter(progress => (progress.progress || 0) >= 95).length;
            const allProgress = user.progress;
            const totalProgress = allProgress.length > 0
                ? Math.round(allProgress.reduce((sum, progress) => sum + (progress.progress || 0), 0) / allProgress.length)
                : 0;
            const totalQuestions = user.questions.length;
            const totalNotes = user.notes.length;
            const lastActive = user.userSessions.length > 0
                ? user.userSessions.reduce((latest, session) => session.lastActivity > latest ? session.lastActivity : latest, user.userSessions[0].lastActivity)
                : user.progress.length > 0
                    ? user.progress.reduce((latest, progress) => progress.updatedAt > latest ? progress.updatedAt : latest, user.progress[0].updatedAt)
                    : user.createdAt;
            return {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                todayWatched,
                todayCompleted,
                thisWeekWatched,
                thisWeekCompleted,
                totalQuestions,
                totalNotes,
                lastActive: lastActive.toISOString(),
                totalProgress
            };
        }));
        return userActivities;
    }
    async getDailyStats(period) {
        const now = new Date();
        let startDate;
        let days;
        switch (period) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                days = 1;
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                days = 7;
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                days = 30;
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                days = 1;
        }
        const dailyStats = [];
        for (let i = 0; i < days; i++) {
            const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
            const nextDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
            const dayProgress = await this.prisma.lessonProgress.findMany({
                where: {
                    updatedAt: {
                        gte: currentDate,
                        lt: nextDate
                    }
                }
            });
            const dayQuestions = await this.prisma.question.findMany({
                where: {
                    createdAt: {
                        gte: currentDate,
                        lt: nextDate
                    }
                }
            });
            const dayNotes = await this.prisma.note.findMany({
                where: {
                    createdAt: {
                        gte: currentDate,
                        lt: nextDate
                    }
                }
            });
            const totalWatched = dayProgress.reduce((sum, progress) => {
                const progressPercent = progress.progress || 0;
                const estimatedWatchedSeconds = Math.floor((progressPercent / 100) * 300);
                return sum + estimatedWatchedSeconds;
            }, 0);
            const totalCompleted = dayProgress.filter(progress => (progress.progress || 0) >= 95).length;
            const activeUsers = new Set(dayProgress.map(progress => progress.userId)).size;
            dailyStats.push({
                date: currentDate.toISOString(),
                totalWatched,
                totalCompleted,
                totalQuestions: dayQuestions.length,
                totalNotes: dayNotes.length,
                activeUsers
            });
        }
        return dailyStats;
    }
    async getWeeklyStats(period) {
        const now = new Date();
        let startDate;
        let weeks;
        switch (period) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                weeks = 1;
                break;
            case 'week':
                startDate = new Date(now.getTime() - 4 * 7 * 24 * 60 * 60 * 1000);
                weeks = 4;
                break;
            case 'month':
                startDate = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000);
                weeks = 12;
                break;
            default:
                startDate = new Date(now.getTime() - 4 * 7 * 24 * 60 * 60 * 1000);
                weeks = 4;
        }
        const weeklyStats = [];
        for (let i = 0; i < weeks; i++) {
            const weekStart = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
            const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
            const weekProgress = await this.prisma.lessonProgress.findMany({
                where: {
                    updatedAt: {
                        gte: weekStart,
                        lt: weekEnd
                    }
                }
            });
            const weekQuestions = await this.prisma.question.findMany({
                where: {
                    createdAt: {
                        gte: weekStart,
                        lt: weekEnd
                    }
                }
            });
            const weekNotes = await this.prisma.note.findMany({
                where: {
                    createdAt: {
                        gte: weekStart,
                        lt: weekEnd
                    }
                }
            });
            const totalWatched = weekProgress.reduce((sum, progress) => {
                const progressPercent = progress.progress || 0;
                const estimatedWatchedSeconds = Math.floor((progressPercent / 100) * 300);
                return sum + estimatedWatchedSeconds;
            }, 0);
            const totalCompleted = weekProgress.filter(progress => (progress.progress || 0) >= 95).length;
            const activeUsers = new Set(weekProgress.map(progress => progress.userId)).size;
            const averageProgress = weekProgress.length > 0
                ? Math.round(weekProgress.reduce((sum, progress) => sum + (progress.progress || 0), 0) / weekProgress.length)
                : 0;
            const weekLabel = `${weekStart.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}`;
            weeklyStats.push({
                week: weekLabel,
                totalWatched,
                totalCompleted,
                totalQuestions: weekQuestions.length,
                totalNotes: weekNotes.length,
                activeUsers,
                averageProgress
            });
        }
        return weeklyStats;
    }
    async getDetailedQuestions(period) {
        const now = new Date();
        let startDate;
        switch (period) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }
        const questions = await this.prisma.question.findMany({
            where: {
                createdAt: {
                    gte: startDate
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                lesson: {
                    select: {
                        id: true,
                        title: true,
                        section: {
                            select: {
                                course: {
                                    select: {
                                        id: true,
                                        title: true
                                    }
                                }
                            }
                        }
                    }
                },
                answers: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                role: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return questions;
    }
    async getDetailedNotes(period) {
        const now = new Date();
        let startDate;
        switch (period) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }
        const notes = await this.prisma.note.findMany({
            where: {
                createdAt: {
                    gte: startDate
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                lesson: {
                    select: {
                        id: true,
                        title: true,
                        section: {
                            select: {
                                course: {
                                    select: {
                                        id: true,
                                        title: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return notes;
    }
    async getLessonActivity(lessonId) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: {
                section: {
                    select: {
                        course: {
                            select: {
                                id: true,
                                title: true
                            }
                        }
                    }
                },
                progress: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        }
                    }
                },
                questions: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        },
                        answers: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        role: true
                                    }
                                }
                            }
                        }
                    }
                },
                notes: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
        return lesson;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map