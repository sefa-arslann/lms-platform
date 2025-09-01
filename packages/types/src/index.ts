// User & Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
  EDITOR = 'editor',
  INSTRUCTOR = 'instructor'
}

// Course Types
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  currency: string;
  duration: number; // minutes
  level: CourseLevel;
  language: string;
  instructorId: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

// Lesson Types
export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  secureVideoUrl?: string; // Added for secure video streaming
  duration: number; // seconds
  order: number;
  sectionId: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Section Types
export interface Section {
  id: string;
  title: string;
  description: string;
  order: number;
  courseId: string;
  lessons: Lesson[];
  createdAt: Date;
  updatedAt: Date;
}

// Order & Payment Types
export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  paymentMethod: string;
  paymentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

// Device Management Types
export interface UserDevice {
  id: string;
  userId: string;
  installId: string;
  publicKey: string;
  platform: string;
  model: string;
  userAgent?: string;
  firstIp: string;
  lastIp: string;
  lastSeenAt: Date;
  isTrusted: boolean;
  isActive: boolean;
  approvedAt?: Date;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
