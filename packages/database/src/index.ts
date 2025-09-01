// Database package exports
export * from './prisma';
export * from './seed';

// Re-export Prisma types
export type { PrismaClient } from '@prisma/client';
export type { User, Course, Lesson, Order, AccessGrant, UserDevice } from '@prisma/client';
