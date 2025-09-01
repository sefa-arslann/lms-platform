export interface CourseSection {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  totalLessons: number;
  isPublished: boolean;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  order: number;
  isPublished: boolean;
  videoUrl: string;
  thumbnail?: string;
  videoType: 'VIDEO' | 'LIVE' | 'QUIZ' | 'ASSIGNMENT';
  isFree: boolean;
  resources?: string[];
}

export interface CourseQnA {
  id: string;
  question: string;
  answer?: string;
  askedBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  answeredBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  isAnswered: boolean;
  isPublic: boolean;
  createdAt: string;
  answeredAt?: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  currency: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  language: string;
  category: string;
  tags: string[];
  duration: number;
  totalLessons: number;
  totalSections: number;
  isPublished: boolean;
  isActive: boolean;
  thumbnail: string;
  previewVideo: string;
  requirements: string[];
  whatYouWillLearn: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  enrolledStudents: number;
  completionRate: number;
  averageRating: number;
  totalReviews: number;
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  sections?: CourseSection[];
  qna?: CourseQnA[];
}
