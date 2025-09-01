import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CmsService } from '../cms/cms.service';
import { VideoMetadataService } from '../video-metadata/video-metadata.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cmsService: CmsService,
    private readonly videoMetadataService: VideoMetadataService,
  ) {}

  async getDashboardStats() {
    try {
      // Get real data from database
      const [
        totalUsers,
        totalCourses,
        totalRevenue,
        pendingDeviceRequests,
        recentUsers,
        recentCourses
      ] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.course.count(),
        this.prisma.order.aggregate({
          _sum: { amount: true }
        }),
        this.prisma.deviceEnrollRequest.count({
          where: { status: 'PENDING' }
        }),
        this.prisma.user.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true
          }
        }),
        this.prisma.course.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            isPublished: true,
            createdAt: true
          }
        })
      ]);

      return {
        users: {
          total: totalUsers,
          students: await this.prisma.user.count({ where: { role: UserRole.STUDENT } }),
          instructors: await this.prisma.user.count({ where: { role: UserRole.INSTRUCTOR } }),
          admins: await this.prisma.user.count({ where: { role: UserRole.ADMIN } }),
        },
        courses: {
          total: totalCourses,
          pendingApproval: await this.prisma.course.count({ where: { isPublished: false } }),
        },
        revenue: {
          total: totalRevenue._sum.amount || 0,
          currency: 'TRY',
        },
        devices: {
          pendingRequests: pendingDeviceRequests,
        },
        analytics: {
          activeUsers: await this.prisma.userSession.count({ where: { isActive: true } }),
          totalVideoViews: await this.prisma.videoAnalytics.count(),
          totalCourseViews: await this.prisma.courseView.count(),
          averageSessionDuration: 0, // TODO: Calculate from user sessions
          todayEvents: await this.prisma.analyticsEvent.count({
            where: {
              createdAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
              }
            }
          }),
          todayUniqueUsers: await this.prisma.userSession.count({
            where: {
              startedAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
              }
            }
          }),
        },
        recent: {
          users: recentUsers,
          courses: recentCourses,
          activity: [], // TODO: Implement activity tracking
          courseViews: [], // TODO: Implement course views
          videoActions: [], // TODO: Implement video actions
        },
        topCourses: [], // TODO: Implement top courses based on views
        reports: {
          totalQuestions: await this.prisma.question.count(),
          totalNotes: await this.prisma.note.count(),
          unansweredQuestions: await this.prisma.question.count({
            where: {
              answers: { none: {} }
            }
          }),
          totalMessages: await this.prisma.message.count(),
          unreadMessages: await this.prisma.message.count({
            where: {
              isRead: false
            }
          }),
        },
      };
    } catch (error) {
      this.logger.error('Error getting dashboard stats:', error);
      throw error;
    }
  }

  async getUserManagementStats() {
    try {
      const [byRole, byStatus, recent] = await Promise.all([
        this.prisma.user.groupBy({
          by: ['role'],
          _count: { role: true }
        }),
        this.prisma.user.groupBy({
          by: ['isActive'],
          _count: { isActive: true }
        }),
        this.prisma.user.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            createdAt: true
          }
        })
      ]);

      return {
        byRole: byRole.map(item => ({ role: item.role, count: item._count.role })),
        byStatus: byStatus.map(item => ({ isActive: item.isActive, count: item._count.isActive })),
        recent,
      };
    } catch (error) {
      this.logger.error('Error getting user management stats:', error);
      throw error;
    }
  }

  async getCourseManagementStats() {
    try {
      const [byStatus, byInstructor, pendingApprovals] = await Promise.all([
        this.prisma.course.groupBy({
          by: ['isPublished'],
          _count: { isPublished: true }
        }),
        this.prisma.course.groupBy({
          by: ['instructorId'],
          _count: { instructorId: true }
        }),
        this.prisma.course.findMany({
          where: { isPublished: false },
          include: {
            instructor: {
              select: { firstName: true, lastName: true }
            }
          }
        })
      ]);

      return {
        byStatus: byStatus.map(item => ({ isPublished: item.isPublished, count: item._count.isPublished })),
        byInstructor: byInstructor.map(item => ({ instructor: 'Site Sahibi', count: item._count.instructorId })),
        pendingApprovals,
      };
    } catch (error) {
      this.logger.error('Error getting course management stats:', error);
      throw error;
    }
  }

  async getDeviceManagementStats() {
    try {
      const [pendingRequests, statistics, recentActivity] = await Promise.all([
        this.prisma.deviceEnrollRequest.count({ where: { status: 'PENDING' } }),
        this.prisma.userDevice.groupBy({
          by: ['platform'],
          _count: { platform: true }
        }),
        this.prisma.deviceEnrollRequest.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { email: true, firstName: true, lastName: true }
            }
          }
        })
      ]);

      return {
        pendingRequests,
        statistics: statistics.map(item => ({ platform: item.platform, count: item._count.platform })),
        recentActivity,
      };
    } catch (error) {
      this.logger.error('Error getting device management stats:', error);
      throw error;
    }
  }

  async getUsers(page = 1, limit = 20, role?: UserRole, search?: string) {
    try {
      const where: any = {};
      if (role) where.role = role;
      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          skip: (page - 1) * limit,
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
            updatedAt: true
          }
        }),
        this.prisma.user.count({ where })
      ]);

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error('Error getting users:', error);
      throw error;
    }
  }

  async getDeviceRequests() {
    try {
      this.logger.log('Fetching device requests...');
      
      // Return only PENDING requests
      const requests = await this.prisma.deviceEnrollRequest.findMany({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'desc' }
      });

      this.logger.log(`Found ${requests.length} device requests`);

      // Get all users at once
      const users = await this.prisma.user.findMany();
      const userMap = new Map(users.map(user => [user.id, user]));

      const result = {
        requests: requests.map(request => {
          const user = userMap.get(request.userId);
          return {
            id: request.id,
            userId: request.userId,
            userEmail: user?.email || 'unknown@example.com',
            userName: user ? `${user.firstName || 'Unknown'} ${user.lastName || 'User'}` : 'Unknown User',
            installId: request.installId || 'unknown',
            platform: request.platform || 'unknown',
            model: request.model || 'unknown',
            status: request.status || 'PENDING',
            createdAt: request.createdAt?.toISOString() || new Date().toISOString()
          };
        })
      };

      this.logger.log(`Returning ${result.requests.length} processed requests`);
      return result;
    } catch (error) {
      this.logger.error('Error getting device requests:', error);
      this.logger.error(error.stack || error);
      throw error;
    }
  }

  async getUserDevices() {
    try {
      const devices = await this.prisma.userDevice.findMany({
        orderBy: { lastSeenAt: 'desc' }
      });

      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true
        }
      });

      const userMap = new Map(users.map(user => [user.id, user]));

      const devicesWithUsers = devices.map(device => {
        const user = userMap.get(device.userId);
        return {
          id: device.id,
          userId: device.userId,
          userEmail: user?.email || 'Unknown',
          userName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User' : 'Unknown User',
          deviceName: device.deviceName,
          platform: device.platform,
          model: device.model,
          isActive: device.isActive,
          isTrusted: device.isTrusted,
          lastSeenAt: device.lastSeenAt
        };
      });

      return { devices: devicesWithUsers };
    } catch (error) {
      this.logger.error('Error getting user devices:', error);
      throw error;
    }
  }



  async denyDeviceRequest(requestId: string) {
    try {
      const request = await this.prisma.deviceEnrollRequest.findUnique({
        where: { id: requestId }
      });

      if (!request) {
        throw new Error('Device request not found');
      }

      if (request.status !== 'PENDING') {
        throw new Error('Device request is not pending');
      }

      // Update request status
      await this.prisma.deviceEnrollRequest.update({
        where: { id: requestId },
        data: { status: 'DENIED' }
      });

      return { message: 'Device request denied successfully' };
    } catch (error) {
      this.logger.error('Error denying device request:', error);
      throw error;
    }
  }

  async getUserDevicesByUserId(userId: string) {
    try {
      this.logger.log(`Fetching devices for user: ${userId}`);
      
      const devices = await this.prisma.userDevice.findMany({
        where: { userId },
        orderBy: { lastSeenAt: 'desc' }
      });
      
      this.logger.log(`Found ${devices.length} devices for user ${userId}`);
      
      const devicesWithUser = devices.map(device => ({
        id: device.id,
        deviceName: device.deviceName || device.model || 'Unknown Device',
        platform: device.platform,
        model: device.model,
        userAgent: device.userAgent || 'Unknown',
        lastUsedAt: device.lastSeenAt?.toISOString() || new Date().toISOString(),
        isActive: device.isActive
      }));
      
      return { devices: devicesWithUser };
    } catch (error) {
      this.logger.error('Error getting user devices:', error);
      throw error;
    }
  }

  async createCourse(createCourseDto: any) {
    try {
      this.logger.log('Creating new course...');
      
      // KDV hesaplaması yap
      let finalPrice = createCourseDto.price || 0;
      if (createCourseDto.taxIncluded !== undefined && createCourseDto.price) {
        const priceCalculation = await this.calculatePriceWithTax(
          createCourseDto.price,
          createCourseDto.taxIncluded === 'included'
        );
        
        // Eğer KDV hariç fiyat girildiyse, KDV dahil fiyatı kaydet
        if (createCourseDto.taxIncluded === 'excluded') {
          finalPrice = priceCalculation.totalPrice;
        }
        
        this.logger.log(`Price calculation: ${JSON.stringify(priceCalculation)}`);
      }
      
      const course = await this.prisma.course.create({
        data: {
          title: createCourseDto.title,
          slug: createCourseDto.slug || createCourseDto.title.toLowerCase().replace(/\s+/g, '-'),
          description: createCourseDto.description,
          level: createCourseDto.level || 'BEGINNER',
          price: finalPrice,
          instructorId: createCourseDto.instructorId,
          isPublished: false,
          duration: createCourseDto.duration || 0,
          language: createCourseDto.language || 'tr',
          thumbnail: createCourseDto.thumbnail,
          currency: createCourseDto.currency || 'TRY',
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
      
      this.logger.log(`Course created successfully: ${course.id}`);
      return course;
    } catch (error) {
      this.logger.error('Error creating course:', error);
      throw error;
    }
  }

  async deleteCourse(courseId: string) {
    try {
      this.logger.log(`Deleting course: ${courseId}`);
      
      // Check if course exists
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
        include: {
          sections: {
            include: {
              lessons: true,
            },
          },
        },
      });
      
      if (!course) {
        throw new Error('Course not found');
      }
      
      // Delete all lessons first
      for (const section of course.sections) {
        await this.prisma.lesson.deleteMany({
          where: { sectionId: section.id },
        });
      }
      
      // Delete all sections
      await this.prisma.section.deleteMany({
        where: { courseId },
      });
      
      // Delete the course
      await this.prisma.course.delete({
        where: { id: courseId },
      });
      
      this.logger.log(`Course deleted successfully: ${courseId}`);
      return { message: 'Course deleted successfully' };
    } catch (error) {
      this.logger.error('Error deleting course:', error);
      throw error;
    }
  }

  async calculateCourseDuration(courseId: string) {
    try {
      this.logger.log(`Calculating duration for course: ${courseId}`);
      
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
        include: {
          sections: {
            include: {
              lessons: {
                select: {
                  duration: true,
                  videoUrl: true,
                },
              },
            },
          },
        },
      });
      
      if (!course) {
        throw new Error('Course not found');
      }
      
      let totalDuration = 0;
      let totalLessons = 0;
      let lessonsWithVideo = 0;
      
      for (const section of course.sections) {
        for (const lesson of section.lessons) {
          totalLessons++;
          if (lesson.duration) {
            // lesson.duration saniye cinsinden, toplam süreye ekle
            totalDuration += lesson.duration;
          }
          if (lesson.videoUrl) {
            lessonsWithVideo++;
          }
        }
      }
      
      // Eğer derslerde süre yoksa, varsayılan süre ata
      if (totalDuration === 0 && totalLessons > 0) {
        totalDuration = totalLessons * 15; // Her ders için 15 dakika varsayılan
      }
      
      // Kurs süresini güncelle
      await this.prisma.course.update({
        where: { id: courseId },
        data: { duration: totalDuration },
      });
      
      this.logger.log(`Course duration calculated: ${Math.round(totalDuration / 60 * 100) / 100} minutes (${totalDuration} seconds) for ${totalLessons} lessons`);
      
      return {
        courseId,
        totalDuration: totalDuration, // Saniye cinsinden
        totalLessons,
        lessonsWithVideo,
        averageLessonDuration: totalLessons > 0 ? Math.round(totalDuration / totalLessons) : 0,
        durationInMinutes: Math.round(totalDuration / 60 * 100) / 100, // Saniyeyi dakikaya çevir
        durationInHours: totalDuration >= 3600 ? Math.floor(totalDuration / 3600) : 0, // Saniyeyi saate çevir
        durationInMinutesRemaining: totalDuration >= 3600 ? Math.floor((totalDuration % 3600) / 60) : Math.floor(totalDuration / 60),
      };
    } catch (error) {
      this.logger.error('Error calculating course duration:', error);
      throw error;
    }
  }

  async getTaxRate(): Promise<number> {
    try {
      const settings = await this.cmsService.getSiteSettings();
      return Number(settings.tax_rate) || 20; // Default 20%
    } catch (error) {
      this.logger.error('Error getting tax rate:', error);
      return 20; // Fallback to 20%
    }
  }

  async getDefaultTaxIncluded(): Promise<boolean> {
    try {
      const settings = await this.cmsService.getSiteSettings();
      const value = settings.tax_included_by_default;
      // String olarak saklanıyorsa boolean'a çevir
      if (typeof value === 'string') {
        return value === 'true';
      }
      return Boolean(value);
    } catch (error) {
      this.logger.error('Error getting default tax included:', error);
      return true; // Fallback to true
    }
  }

  async calculatePriceWithTax(price: number, taxIncluded: boolean = true): Promise<{
    netPrice: number;
    taxAmount: number;
    totalPrice: number;
    taxRate: number;
  }> {
    const taxRate = await this.getTaxRate();
    const taxMultiplier = 1 + (taxRate / 100);

    let netPrice: number;
    let totalPrice: number;
    let taxAmount: number;

    if (taxIncluded) {
      // Price includes tax, calculate net price
      totalPrice = price;
      netPrice = price / taxMultiplier;
      taxAmount = totalPrice - netPrice;
    } else {
      // Price excludes tax, calculate total price
      netPrice = price;
      taxAmount = price * (taxRate / 100);
      totalPrice = netPrice + taxAmount;
    }

    return {
      netPrice: Math.round(netPrice * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      totalPrice: Math.round(totalPrice * 100) / 100,
      taxRate,
    };
  }

  async getVideoDuration(videoUrl: string): Promise<{
    durationInSeconds: number;
    durationInMinutes: number;
    formattedDuration: string;
  }> {
    try {
      this.logger.log(`Getting video duration for: ${videoUrl}`);
      
      // Video URL'inin geçerli olup olmadığını kontrol et
      const isValidUrl = await this.videoMetadataService.isVideoUrlValid(videoUrl);
      if (!isValidUrl) {
        throw new Error('Invalid video URL');
      }
      
      // Video süresini al (saniye cinsinden)
      const durationInSeconds = await this.videoMetadataService.getVideoDuration(videoUrl);
      
      // Saniyeyi dakikaya çevir (tam değer)
      const durationInMinutes = durationInSeconds / 60;
      
      // Formatlanmış süreyi hesapla (tam değerler)
      const hours = Math.floor(durationInMinutes / 60);
      const minutes = Math.floor(durationInMinutes % 60);
      const seconds = Math.floor((durationInMinutes % 1) * 60);
      
      let formattedDuration = '';
      
      if (hours > 0) {
        if (minutes > 0 && seconds > 0) {
          formattedDuration = `${hours} saat ${minutes} dakika ${seconds} saniye`;
        } else if (minutes > 0) {
          formattedDuration = `${hours} saat ${minutes} dakika`;
        } else {
          formattedDuration = `${hours} saat ${seconds} saniye`;
        }
      } else if (minutes > 0) {
        if (seconds > 0) {
          formattedDuration = `${minutes} dakika ${seconds} saniye`;
        } else {
          formattedDuration = `${minutes} dakika`;
        }
      } else {
        formattedDuration = `${seconds} saniye`;
      }
      
      this.logger.log(`Video duration: ${durationInSeconds} seconds = ${durationInMinutes.toFixed(2)} minutes, formatted: ${formattedDuration}`);
      const returnData = {
        durationInSeconds,
        durationInMinutes: Math.round(durationInMinutes * 100) / 100, // 2 ondalık basamak
        formattedDuration
      };
      
      this.logger.log(`Returning data: ${JSON.stringify(returnData)}`);
      
      return returnData;
    } catch (error) {
      this.logger.error(`Error getting video duration: ${error.message}`);
      throw error;
    }
  }

  async getVideoMetadata(videoUrl: string): Promise<{
    duration: number;
    width?: number;
    height?: number;
    format?: string;
    bitrate?: number;
  }> {
    try {
      this.logger.log(`Getting video duration for: ${videoUrl}`);
      
      // Video URL'inin geçerli olup olmadığını kontrol et
      const isValidUrl = await this.videoMetadataService.isVideoUrlValid(videoUrl);
      if (!isValidUrl) {
        throw new Error('Invalid video URL');
      }
      
      // Video metadata'sını al
      const metadata = await this.videoMetadataService.getVideoMetadata(videoUrl);
      
      this.logger.log(`Video metadata retrieved: ${JSON.stringify(metadata)}`);
      return metadata;
    } catch (error) {
      this.logger.error(`Error getting video metadata: ${error.message}`);
      throw error;
    }
  }

  async updateDeviceStatus(deviceId: string, body: { isActive: boolean; isTrusted?: boolean }) {
    try {
      this.logger.log(`Updating device status for device ID: ${deviceId}`);
      
      const updatedDevice = await this.prisma.userDevice.update({
        where: { id: deviceId },
        data: {
          isActive: body.isActive,
          ...(body.isTrusted !== undefined && { isTrusted: body.isTrusted }),
          updatedAt: new Date()
        }
      });
      
      this.logger.log(`Device status updated successfully: ${deviceId}`);
      return updatedDevice;
    } catch (error) {
      this.logger.error(`Error updating device status: ${error.message}`);
      throw error;
    }
  }

  async approveDeviceRequest(requestId: string, body: { deviceName: string; isTrusted?: boolean }) {
    try {
      this.logger.log(`Approving device enrollment request: ${requestId}`);
      
      // Get the request
      const request = await this.prisma.deviceEnrollRequest.findUnique({
        where: { id: requestId }
      });
      
      if (!request) {
        throw new Error('Device enrollment request not found');
      }
      
      // Create new device
      const newDevice = await this.prisma.userDevice.create({
        data: {
          userId: request.userId,
          installId: request.installId || 'unknown',
          platform: request.platform,
          model: request.model,
          deviceName: body.deviceName,
          isActive: true,
          isTrusted: body.isTrusted || false,
          approvedAt: new Date(),
          publicKey: `pk_approved_${requestId}`,
          userAgent: 'LMS-Web/1.0.0',
          firstIp: request.ip,
          lastIp: request.ip,
          lastSeenAt: new Date()
        }
      });
      
      // Update request status
      await this.prisma.deviceEnrollRequest.update({
        where: { id: requestId },
        data: { status: 'APPROVED' }
      });
      
      this.logger.log(`Device enrollment request approved successfully: ${requestId}`);
      return newDevice;
    } catch (error) {
      this.logger.error(`Error approving device enrollment request: ${error.message}`);
      throw error;
    }
  }

  async deleteDevice(deviceId: string) {
    try {
      this.logger.log(`Deleting device: ${deviceId}`);
      
      // Delete the device
      await this.prisma.userDevice.delete({
        where: { id: deviceId }
      });
      
      this.logger.log(`Device deleted successfully: ${deviceId}`);
      return { message: 'Device deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting device: ${error.message}`);
      throw error;
    }
  }

  async getAllOrders() {
    try {
      const orders = await this.prisma.order.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            }
          },
          course: {
            select: {
              id: true,
              title: true,
            }
          }
        },
        orderBy: {
          purchasedAt: 'desc'
        }
      });

      return orders.map(order => ({
        id: order.id,
        courseId: order.courseId,
        courseTitle: order.course?.title || 'Kurs Adı Bulunamadı',
        userId: order.userId,
        userEmail: order.user?.email || 'Email Bulunamadı',
        userName: order.user ? `${order.user.firstName} ${order.user.lastName}` : 'İsim Bulunamadı',
        amount: order.amount,
        paymentMethod: order.paymentMethod,
        status: order.status,
        createdAt: order.purchasedAt,
        metadata: order.metadata
      }));
    } catch (error) {
      this.logger.error('Error getting all orders:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, newStatus: string) {
    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: { status: newStatus as any },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            }
          },
          course: {
            select: {
              id: true,
              title: true,
            }
          }
        }
      });

      return {
        id: updatedOrder.id,
        courseId: updatedOrder.courseId,
        courseTitle: updatedOrder.course?.title || 'Kurs Adı Bulunamadı',
        userId: updatedOrder.userId,
        userEmail: updatedOrder.user?.email || 'Email Bulunamadı',
        userName: updatedOrder.user ? `${updatedOrder.user.firstName} ${updatedOrder.user.lastName}` : 'İsim Bulunamadı',
        amount: updatedOrder.amount,
        paymentMethod: updatedOrder.paymentMethod,
        status: updatedOrder.status,
        createdAt: updatedOrder.purchasedAt,
        metadata: updatedOrder.metadata
      };
    } catch (error) {
      this.logger.error('Error updating order status:', error);
      throw error;
    }
  }

  // Soru-Cevap Yönetimi
  async getAllQuestions(status: 'all' | 'unanswered' | 'answered' = 'all') {
    const whereClause: any = {};
    
    if (status === 'unanswered') {
      whereClause.answers = { none: {} };
    } else if (status === 'answered') {
      whereClause.answers = { some: {} };
    }

    const questions = await this.prisma.question.findMany({
      where: whereClause,
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
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return questions;
  }

  async getQuestionDetails(questionId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
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
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!question) {
      throw new Error('Question not found');
    }

    return question;
  }

  async answerQuestion(questionId: string, content: string) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      throw new Error('Question not found');
    }

    const answer = await this.prisma.answer.create({
      data: {
        questionId,
        content,
        userId: 'admin' // Admin user ID - you might need to adjust this
      }
    });

    return answer;
  }

  async updateQuestionStatus(questionId: string, status: 'pending' | 'answered' | 'closed') {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      throw new Error('Question not found');
    }

    // Update question status (you might need to add this field to your schema)
    const updatedQuestion = await this.prisma.question.update({
      where: { id: questionId },
      data: {
        // status: status // Uncomment if you have status field
      }
    });

    return updatedQuestion;
  }

  // Silme İşlemleri
  async deleteQuestion(questionId: string) {
    try {
      // Önce question'ı kontrol et
      const question = await this.prisma.question.findUnique({
        where: { id: questionId }
      });

      if (!question) {
        throw new Error('Question not found');
      }

      // Önce tüm answer'ları sil
      await this.prisma.answer.deleteMany({
        where: { questionId }
      });

      // Sonra question'ı sil
      await this.prisma.question.delete({
        where: { id: questionId }
      });

      this.logger.log(`Question deleted successfully: ${questionId}`);
      return { message: 'Question and all answers deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting question: ${error.message}`);
      throw error;
    }
  }

  async deleteNote(noteId: string) {
    try {
      const note = await this.prisma.note.findUnique({
        where: { id: noteId }
      });

      if (!note) {
        throw new Error('Note not found');
      }

      await this.prisma.note.delete({
        where: { id: noteId }
      });

      this.logger.log(`Note deleted successfully: ${noteId}`);
      return { message: 'Note deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting note: ${error.message}`);
      throw error;
    }
  }

  async deleteMessage(messageId: string) {
    try {
      const message = await this.prisma.message.findUnique({
        where: { id: messageId }
      });

      if (!message) {
        throw new Error('Message not found');
      }

      // Önce tüm reply'ları sil
      await this.prisma.messageReply.deleteMany({
        where: { messageId }
      });

      // Sonra tüm attachment'ları sil
      await this.prisma.messageAttachment.deleteMany({
        where: { messageId }
      });

      // Son olarak message'ı sil
      await this.prisma.message.delete({
        where: { id: messageId }
      });

      this.logger.log(`Message deleted successfully: ${messageId}`);
      return { message: 'Message and all replies deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting message: ${error.message}`);
      throw error;
    }
  }

  async deleteAnswer(answerId: string) {
    try {
      const answer = await this.prisma.answer.findUnique({
        where: { id: answerId }
      });

      if (!answer) {
        throw new Error('Answer not found');
      }

      await this.prisma.answer.delete({
        where: { id: answerId }
      });

      this.logger.log(`Answer deleted successfully: ${answerId}`);
      return { message: 'Answer deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting answer: ${error.message}`);
      throw error;
    }
  }
}
