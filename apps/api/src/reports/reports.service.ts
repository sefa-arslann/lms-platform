import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface DailyStats {
  date: string;
  totalWatched: number;
  totalCompleted: number;
  totalQuestions: number;
  totalNotes: number;
  activeUsers: number;
}

export interface WeeklyStats {
  week: string;
  totalWatched: number;
  totalCompleted: number;
  totalQuestions: number;
  totalNotes: number;
  activeUsers: number;
  averageProgress: number;
}

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getUserActivities(period: 'today' | 'week' | 'month') {
    const now = new Date();
    let startDate: Date;

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

    // Get all users with their activities
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

    const userActivities = await Promise.all(
      users.map(async (user) => {
        // Calculate today's watched time and completed lessons
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayProgress = user.progress.filter(
          progress => progress.updatedAt >= todayStart
        );

        const todayWatched = todayProgress.reduce((sum, progress) => {
          // Calculate watched time based on progress and lesson duration
          // This is a simplified calculation - you might want to store actual watched time
          const progressPercent = progress.progress || 0;
          const estimatedWatchedSeconds = Math.floor((progressPercent / 100) * 300); // Assuming 5 min lessons
          return sum + estimatedWatchedSeconds;
        }, 0);

        const todayCompleted = todayProgress.filter(
          progress => (progress.progress || 0) >= 95
        ).length;

        // Calculate this week's watched time and completed lessons
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const weekProgress = user.progress.filter(
          progress => progress.updatedAt >= weekStart
        );

        const thisWeekWatched = weekProgress.reduce((sum, progress) => {
          const progressPercent = progress.progress || 0;
          const estimatedWatchedSeconds = Math.floor((progressPercent / 100) * 300);
          return sum + estimatedWatchedSeconds;
        }, 0);

        const thisWeekCompleted = weekProgress.filter(
          progress => (progress.progress || 0) >= 95
        ).length;

        // Calculate total progress across all courses
        const allProgress = user.progress;
        const totalProgress = allProgress.length > 0 
          ? Math.round(allProgress.reduce((sum, progress) => sum + (progress.progress || 0), 0) / allProgress.length)
          : 0;

        // Get total questions and notes
        const totalQuestions = user.questions.length;
        const totalNotes = user.notes.length;

        // Get last active time from sessions, progress, or course views
        const lastActive = user.userSessions.length > 0
          ? user.userSessions.reduce((latest, session) => 
              session.lastActivity > latest ? session.lastActivity : latest
            , user.userSessions[0].lastActivity)
          : user.progress.length > 0
          ? user.progress.reduce((latest, progress) => 
              progress.updatedAt > latest ? progress.updatedAt : latest
            , user.progress[0].updatedAt)
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
      })
    );

    return userActivities;
  }

  async getDailyStats(period: 'today' | 'week' | 'month') {
    const now = new Date();
    let startDate: Date;
    let days: number;

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

    const dailyStats: DailyStats[] = [];

    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const nextDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);

      // Get lesson progress for this day
      const dayProgress = await this.prisma.lessonProgress.findMany({
        where: {
          updatedAt: {
            gte: currentDate,
            lt: nextDate
          }
        }
      });

      // Get questions for this day
      const dayQuestions = await this.prisma.question.findMany({
        where: {
          createdAt: {
            gte: currentDate,
            lt: nextDate
          }
        }
      });

      // Get notes for this day
      const dayNotes = await this.prisma.note.findMany({
        where: {
          createdAt: {
            gte: currentDate,
            lt: nextDate
          }
        }
      });

      // Calculate total watched time for this day
      const totalWatched = dayProgress.reduce((sum, progress) => {
        const progressPercent = progress.progress || 0;
        const estimatedWatchedSeconds = Math.floor((progressPercent / 100) * 300);
        return sum + estimatedWatchedSeconds;
      }, 0);

      // Calculate completed lessons for this day
      const totalCompleted = dayProgress.filter(
        progress => (progress.progress || 0) >= 95
      ).length;

      // Get unique active users for this day
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

  async getWeeklyStats(period: 'today' | 'week' | 'month') {
    const now = new Date();
    let startDate: Date;
    let weeks: number;

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

    const weeklyStats: WeeklyStats[] = [];

    for (let i = 0; i < weeks; i++) {
      const weekStart = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);

      // Get lesson progress for this week
      const weekProgress = await this.prisma.lessonProgress.findMany({
        where: {
          updatedAt: {
            gte: weekStart,
            lt: weekEnd
          }
        }
      });

      // Get questions for this week
      const weekQuestions = await this.prisma.question.findMany({
        where: {
          createdAt: {
            gte: weekStart,
            lt: weekEnd
          }
        }
      });

      // Get notes for this week
      const weekNotes = await this.prisma.note.findMany({
        where: {
          createdAt: {
            gte: weekStart,
            lt: weekEnd
          }
        }
      });

      // Calculate total watched time for this week
      const totalWatched = weekProgress.reduce((sum, progress) => {
        const progressPercent = progress.progress || 0;
        const estimatedWatchedSeconds = Math.floor((progressPercent / 100) * 300);
        return sum + estimatedWatchedSeconds;
      }, 0);

      // Calculate completed lessons for this week
      const totalCompleted = weekProgress.filter(
        progress => (progress.progress || 0) >= 95
      ).length;

      // Get unique active users for this week
      const activeUsers = new Set(weekProgress.map(progress => progress.userId)).size;

      // Calculate average progress for this week
      const averageProgress = weekProgress.length > 0
        ? Math.round(weekProgress.reduce((sum, progress) => sum + (progress.progress || 0), 0) / weekProgress.length)
        : 0;

      // Format week label
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

  // Detaylı raporlar için yeni metodlar
  async getDetailedQuestions(period: 'today' | 'week' | 'month') {
    const now = new Date();
    let startDate: Date;

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

  async getDetailedNotes(period: 'today' | 'week' | 'month') {
    const now = new Date();
    let startDate: Date;

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

  async getLessonActivity(lessonId: string) {
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
}
