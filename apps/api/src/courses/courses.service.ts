import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto, instructorId: string) {
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

  async findAll(role?: UserRole, userId?: string) {
    if (role === UserRole.STUDENT) {
      // Students can only see published courses
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

    if (role === UserRole.INSTRUCTOR && userId) {
      // Instructors can see their own courses
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

    // Admins can see all courses
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

  async findBySlug(slug: string, role?: UserRole, userId?: string) {
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
      throw new NotFoundException('Course not found');
    }

    // Check access permissions
    if (role === UserRole.STUDENT && !course.isPublished) {
      throw new ForbiddenException('Course not available');
    }

    if (role === UserRole.INSTRUCTOR && course.instructorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return course;
  }

  async findOne(id: string, role?: UserRole, userId?: string) {
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
      throw new NotFoundException('Course not found');
    }

    // Check access permissions
    if (role === UserRole.STUDENT && !course.isPublished) {
      throw new ForbiddenException('Course not available');
    }

    if (role === UserRole.INSTRUCTOR && course.instructorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto, userId: string, role: UserRole) {
    const course = await this.findOne(id, role, userId);

    if (role === UserRole.INSTRUCTOR && course.instructorId !== userId) {
      throw new ForbiddenException('Access denied');
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

  async remove(id: string, userId: string, role: UserRole) {
    const course = await this.findOne(id, role, userId);

    if (role === UserRole.INSTRUCTOR && course.instructorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Soft delete - set isPublished to false
    return this.prisma.course.update({
      where: { id },
      data: { isPublished: false },
    });
  }

  async publish(id: string, userId: string, role: UserRole) {
    const course = await this.findOne(id, role, userId);

    if (role === UserRole.INSTRUCTOR && course.instructorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.course.update({
      where: { id },
      data: { isPublished: true },
    });
  }

  async unpublish(id: string, userId: string, role: UserRole) {
    const course = await this.findOne(id, role, userId);

    if (role === UserRole.INSTRUCTOR && course.instructorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.course.update({
      where: { id },
      data: { isPublished: false },
    });
  }
}
