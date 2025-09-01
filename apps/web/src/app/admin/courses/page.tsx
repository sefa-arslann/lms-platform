'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  BookOpenIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  AcademicCapIcon,
  PhotoIcon,
  TagIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  PlayIcon,
  UsersIcon,
  StarIcon,
  ChartBarIcon,
  GlobeAltIcon,
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { SortableContainer } from '@/components/dnd/SortableContainer';
import { SortableSection } from '@/components/dnd/SortableSection';
import { SortableLesson } from '@/components/dnd/SortableLesson';
import { Course, CourseSection, CourseLesson, CourseQnA } from '@/types/course';
import { formatDuration, formatDurationMMSS, formatDurationHHMMSS } from '@/utils/duration';



export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showQnAModal, setShowQnAModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedSection, setSelectedSection] = useState<CourseSection | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [selectedQnA, setSelectedQnA] = useState<CourseQnA | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Course>>({});
  const [createFormData, setCreateFormData] = useState<Partial<Course> & { taxIncluded?: 'included' | 'excluded' }>({ taxIncluded: 'included' });
  const [sectionFormData, setSectionFormData] = useState<Partial<CourseSection>>({});
  const [lessonFormData, setLessonFormData] = useState<Partial<CourseLesson>>({});
  const [qnaFormData, setQnaFormData] = useState<Partial<CourseQnA>>({});
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [submitting, setSubmitting] = useState(false);
  const [taxSettings, setTaxSettings] = useState<{ taxRate: number; defaultTaxIncluded: boolean }>({ taxRate: 20, defaultTaxIncluded: true });

  // Reorder functions for drag & drop
  const handleSectionsReorder = (newSections: CourseSection[]) => {
    if (selectedCourse) {
      setSelectedCourse({
        ...selectedCourse,
        sections: newSections
      });
    }
    // Update the main courses list as well
    setCourses(prev => prev && Array.isArray(prev) ? prev.map(course => 
      course.id === selectedCourse?.id 
        ? { ...course, sections: newSections }
        : course
    ) : []);
    
    // Save new section order to backend
    saveNewSectionOrder(newSections);
  };

  const saveNewSectionOrder = async (newSections: CourseSection[]) => {
    try {
      // Update section orders in backend
      const updatePromises = newSections.map((section, index) =>
        fetch(`http://localhost:3001/admin/sections/${section.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: index + 1 }),
        })
      );
      
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Failed to save new section order:', error);
    }
  };

  const handleLessonsReorder = (sectionId: string, newLessons: CourseLesson[]) => {
    if (selectedCourse) {
      const updatedSections = selectedCourse.sections?.map(section =>
        section.id === sectionId ? { ...section, lessons: newLessons } : section
      ) || [];
      
      setSelectedCourse({
        ...selectedCourse,
        sections: updatedSections
      });
    }
    // Update the main courses list as well
    setCourses(prev => prev && Array.isArray(prev) ? prev.map(course => 
      course.id === selectedCourse?.id 
        ? { ...course, sections: course.sections?.map(section =>
            section.id === sectionId ? { ...section, lessons: newLessons } : section
          ) || [] }
        : course
    ) : []);
    
    // Save new order to backend
    saveNewOrder(sectionId, newLessons);
  };

  const saveNewOrder = async (sectionId: string, newLessons: CourseLesson[]) => {
    try {
      // Update lesson orders in backend
      const updatePromises = newLessons.map((lesson, index) =>
        fetch(`http://localhost:3001/admin/lessons/${lesson.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: index + 1 }),
        })
      );
      
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Failed to save new order:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchTaxSettings();
  }, []);

  const fetchTaxSettings = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/tax/settings');
      if (response.ok) {
        const data = await response.json();
        setTaxSettings(data);
        // Varsayılan KDV dahil/hariç ayarını güncelle
        setCreateFormData(prev => ({ 
          ...prev, 
          taxIncluded: data.defaultTaxIncluded ? 'included' : 'excluded' 
        }));
      }
    } catch (error) {
      console.error('Failed to fetch tax settings:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/admin/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      
      // Ensure all courses have required array properties and safe numeric values
      const safeCourses = (data.courses || []).map((course: any) => ({
        ...course,
        tags: Array.isArray(course.tags) ? course.tags : [],
        requirements: Array.isArray(course.requirements) ? course.requirements : [],
        whatYouWillLearn: Array.isArray(course.whatYouWillLearn) ? course.whatYouWillLearn : [],
        enrolledStudents: course.enrolledStudents || 0,
        completionRate: course.completionRate || 0,
        averageRating: course.averageRating || 0,
        totalReviews: course.totalReviews || 0,
        instructor: course.instructor || { firstName: 'N/A', lastName: 'N/A', email: 'N/A' },
        sections: Array.isArray(course.sections) ? course.sections.map((section: any) => ({
          ...section,
          lessons: Array.isArray(section.lessons) ? section.lessons : []
        })) : [],
        qna: Array.isArray(course.qna) ? course.qna : []
      }));
      
      setCourses(safeCourses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      // Fallback to mock data
      const mockCourses = getMockCourses();
      // Ensure mock courses also have safe array properties and numeric values
      const safeMockCourses = mockCourses.map((course: Course) => ({
        ...course,
        tags: Array.isArray(course.tags) ? course.tags : [],
        requirements: Array.isArray(course.requirements) ? course.requirements : [],
        whatYouWillLearn: Array.isArray(course.whatYouWillLearn) ? course.whatYouWillLearn : [],
        enrolledStudents: course.enrolledStudents || 0,
        completionRate: course.completionRate || 0,
        averageRating: course.averageRating || 0,
        totalReviews: course.totalReviews || 0,
        instructor: course.instructor || { firstName: 'N/A', lastName: 'N/A', email: 'N/A' },
        sections: Array.isArray(course.sections) ? course.sections.map((section: CourseSection) => ({
          ...section,
          lessons: Array.isArray(section.lessons) ? section.lessons : []
        })) : [],
        qna: Array.isArray(course.qna) ? course.qna : []
      }));
      setCourses(safeMockCourses);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseDetails = async (courseId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/courses/${courseId}`);
      if (response.ok) {
        const course = await response.json();
        setSelectedCourse(course);
      } else {
        console.error('Failed to fetch course details');
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const createCourse = async (courseData: Partial<Course> & { taxIncluded?: 'included' | 'excluded' }) => {
    try {
      setSubmitting(true);
      
      const response = await fetch('http://localhost:3001/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: courseData.title,
          description: courseData.description,
          instructorId: courseData.instructor?.id || 'cmefj940d0000dv47ygoytq4w', // Default admin
          price: courseData.price || 0,
          level: courseData.level || 'BEGINNER',
          duration: courseData.duration || 0,
          language: courseData.language || 'tr',
          thumbnail: courseData.thumbnail,
          currency: courseData.currency || 'TRY',
          taxIncluded: courseData.taxIncluded || 'included',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create course');
      }
      
      const newCourse = await response.json();
      setCourses(prev => [newCourse, ...(prev || [])]);
      setShowCreateModal(false);
      setCreateFormData({ taxIncluded: taxSettings.defaultTaxIncluded ? 'included' : 'excluded' });
      setFormErrors({});
      
      // Show success message
      alert('Kurs başarıyla oluşturuldu!');
    } catch (error) {
      console.error('Failed to create course:', error);
      setFormErrors({ general: 'Kurs oluşturulurken hata oluştu' });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!confirm('Bu kursu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3001/admin/courses/${courseId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete course');
      }
      
      setCourses(prev => prev?.filter(course => course.id !== courseId) || []);
      
      // Show success message
      alert('Kurs başarıyla silindi!');
    } catch (error) {
      console.error('Failed to delete course:', error);
      alert('Kurs silinirken hata oluştu');
    }
  };

  const deleteLesson = async (lessonId: string) => {
    if (!confirm('Bu dersi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3001/admin/lessons/${lessonId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete lesson');
      }
      
      // Update selectedCourse by removing the deleted lesson
      if (selectedCourse) {
        const updatedSections = selectedCourse.sections?.map(section => ({
          ...section,
          lessons: section.lessons?.filter(lesson => lesson.id !== lessonId) || []
        }));
        
        setSelectedCourse({
          ...selectedCourse,
          sections: updatedSections
        });

        // Update main courses list as well
        setCourses(prev => prev?.map(course => 
          course.id === selectedCourse.id 
            ? { ...course, sections: updatedSections }
            : course
        ) || []);
      }
      
      // Show success message
      alert('Ders başarıyla silindi!');
      
      // Kurs süresini otomatik olarak hesapla
      if (selectedCourse) {
        setTimeout(() => {
          calculateCourseDuration(selectedCourse.id);
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to delete lesson:', error);
      alert('Ders silinirken hata oluştu');
    }
  };

  const calculateCourseDuration = async (courseId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/courses/${courseId}/duration`);
      if (!response.ok) {
        throw new Error('Failed to calculate course duration');
      }
      
      const result = await response.json();
      
      // Kurs listesini güncelle
      setCourses(prev => prev?.map(course => 
        course.id === courseId 
          ? { ...course, duration: result.totalDuration }
          : course
      ) || []);
      
      // Seçili kursu da güncelle
      if (selectedCourse && selectedCourse.id === courseId) {
        setSelectedCourse(prev => prev ? { ...prev, duration: result.totalDuration } : null);
      }
      
      // Başarı mesajı - formatlanmış süre ile
      const formattedDuration = formatDuration(result.totalDuration);
      alert(`Kurs süresi hesaplandı: ${formattedDuration} (${result.totalLessons} ders)`);
      
      return result;
    } catch (error) {
      console.error('Failed to calculate course duration:', error);
      alert('Kurs süresi hesaplanırken hata oluştu');
    }
  };

  // Kurs süresini manuel olarak hesapla (frontend'de)
  const calculateCourseDurationManually = (course: Course) => {
    let totalDuration = 0;
    let totalLessons = 0;
    
    course.sections?.forEach(section => {
      section.lessons?.forEach(lesson => {
        if (lesson.duration) {
          totalDuration += lesson.duration;
        }
        totalLessons++;
      });
    });
    
    return {
      totalDuration,
      totalLessons
    };
  };

  const getMockCourses = (): Course[] => [
    {
      id: '1',
      title: 'React ile Modern Web Geliştirme',
      slug: 'react-ile-modern-web-gelistirme',
      description: 'React 18, TypeScript ve modern web teknolojileri ile profesyonel web uygulamaları geliştirin.',
      shortDescription: 'React 18 ve TypeScript ile modern web geliştirme',
      price: 299.99,
      currency: 'TRY',
      level: 'INTERMEDIATE',
      language: 'tr',
      category: 'Web Geliştirme',
      tags: ['react', 'typescript', 'web', 'frontend'],
      duration: 1200, // Bölümlerden hesaplanır
      totalLessons: 45, // Bölümlerden hesaplanır
      totalSections: 8,
      isPublished: true,
      isActive: true,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      previewVideo: 'https://example.com/preview.mp4', // Kurs tanıtım videosu
      requirements: ['HTML', 'CSS', 'JavaScript temelleri'],
      whatYouWillLearn: ['React Hooks', 'TypeScript', 'Modern JavaScript'],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-08-15T10:00:00Z',
      publishedAt: '2024-01-20T10:00:00Z',
      enrolledStudents: 1250,
      completionRate: 78.5,
      averageRating: 4.8,
      totalReviews: 89,
      instructor: {
        id: '1',
        firstName: 'Site',
        lastName: 'Sahibi',
        email: 'instructor@lms.com'
      },
      sections: [
        {
          id: '1',
          title: 'React Temelleri',
          description: 'React kütüphanesinin temel kavramları ve bileşen yapısı',
          order: 1,
          duration: 180, // 3 dakika
          totalLessons: 6,
          isPublished: true,
          lessons: [
            {
              id: '1',
              title: 'React Nedir?',
              description: 'React kütüphanesinin tanıtımı ve avantajları',
              duration: 15,
              order: 1,
              isPublished: true,
              videoUrl: 'https://example.com/videos/react-intro.mp4',
              thumbnail: 'https://example.com/thumbnails/react-intro.jpg',
              videoType: 'VIDEO',
              isFree: true,
              resources: ['https://example.com/docs/react-basics.pdf']
            },
            {
              id: '2',
              title: 'İlk React Uygulaması',
              description: 'Create React App ile ilk uygulamayı oluşturma',
              duration: 25,
              order: 2,
              isPublished: true,
              videoUrl: 'https://example.com/videos/first-app.mp4',
              thumbnail: 'https://example.com/thumbnails/first-app.jpg',
              videoType: 'VIDEO',
              isFree: false,
              resources: ['https://example.com/docs/create-react-app.pdf']
            }
          ]
        },
        {
          id: '2',
          title: 'State ve Props Yönetimi',
          description: 'React\'te state ve props kullanımı',
          order: 2,
          duration: 240, // 4 saat
          totalLessons: 8,
          isPublished: true,
          lessons: [
            {
              id: '3',
              title: 'State Kavramı',
              description: 'React\'te state nedir ve nasıl kullanılır',
              duration: 20,
              order: 1,
              isPublished: true,
              videoUrl: 'https://example.com/videos/state-concept.mp4',
              thumbnail: 'https://example.com/thumbnails/state-concept.jpg',
              videoType: 'VIDEO',
              isFree: false,
              resources: ['https://example.com/docs/state-management.pdf']
            }
          ]
        }
      ],
      qna: [
        {
          id: '1',
          question: 'React Hooks ne zaman kullanılmalı?',
          answer: 'React Hooks, functional component\'larda state ve lifecycle yönetimi için kullanılır. Class component\'lar yerine tercih edilir.',
          askedBy: {
            id: '2',
            firstName: 'Ahmet',
            lastName: 'Yılmaz',
            email: 'ahmet@example.com'
          },
          answeredBy: {
            id: '1',
            firstName: 'Site',
            lastName: 'Sahibi',
            email: 'instructor@lms.com'
          },
          isAnswered: true,
          isPublic: true,
          createdAt: '2024-08-10T10:00:00Z',
          answeredAt: '2024-08-10T14:00:00Z',
          tags: ['react', 'hooks', 'state'],
          upvotes: 15,
          downvotes: 2
        },
        {
          id: '2',
          question: 'TypeScript ile React kullanmak zor mu?',
          answer: '',
          askedBy: {
            id: '3',
            firstName: 'Fatma',
            lastName: 'Demir',
            email: 'fatma@example.com'
          },
          isAnswered: false,
          isPublic: true,
          createdAt: '2024-08-12T15:30:00Z',
          tags: ['typescript', 'react', 'learning'],
          upvotes: 8,
          downvotes: 0
        }
      ]
    },
    {
      id: '2',
      title: 'Node.js Backend Geliştirme',
      slug: 'nodejs-backend-gelistirme',
      description: 'Node.js, Express ve MongoDB ile güçlü backend API\'leri geliştirin.',
      shortDescription: 'Node.js ile backend geliştirme',
      price: 399.99,
      currency: 'TRY',
      level: 'ADVANCED',
      language: 'tr',
      category: 'Backend Geliştirme',
      tags: ['nodejs', 'express', 'mongodb', 'api'],
      requirements: ['JavaScript', 'Async programming'],
      whatYouWillLearn: ['Node.js', 'Express.js', 'MongoDB', 'REST API'],
      duration: 900,
      totalLessons: 32,
      totalSections: 6,
      isPublished: true,
      isActive: true,
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      previewVideo: 'https://example.com/preview2.mp4',
      createdAt: '2024-02-20T10:00:00Z',
      updatedAt: '2024-08-15T10:00:00Z',
      publishedAt: '2024-02-25T10:00:00Z',
      enrolledStudents: 890,
      completionRate: 82.3,
      averageRating: 4.7,
      totalReviews: 67,
      instructor: {
        id: '1',
        firstName: 'Site',
        lastName: 'Sahibi',
        email: 'instructor@lms.com'
      },
      sections: [
        {
          id: '3',
          title: 'Node.js Temelleri',
          description: 'Node.js runtime ve temel kavramlar',
          order: 1,
          duration: 120,
          totalLessons: 4,
          isPublished: true,
          lessons: [
            {
              id: '4',
              title: 'Node.js Nedir?',
              description: 'Node.js runtime ve avantajları',
              duration: 20,
              order: 1,
              isPublished: true,
              videoUrl: 'https://example.com/videos/nodejs-intro.mp4',
              thumbnail: 'https://example.com/thumbnails/nodejs-intro.jpg',
              videoType: 'VIDEO',
              isFree: true,
              resources: []
            }
          ]
        }
      ],
      qna: [
        {
          id: '3',
          question: 'Node.js ile hangi veritabanlarını kullanabilirim?',
          answer: 'Node.js ile MongoDB, PostgreSQL, MySQL, Redis gibi birçok veritabanını kullanabilirsiniz. Her birinin kendine özgü avantajları vardır.',
          askedBy: {
            id: '4',
            firstName: 'Mehmet',
            lastName: 'Kaya',
            email: 'mehmet@example.com'
          },
          answeredBy: {
            id: '1',
            firstName: 'Site',
            lastName: 'Sahibi',
            email: 'instructor@lms.com'
          },
          isAnswered: true,
          isPublic: true,
          createdAt: '2024-08-08T09:00:00Z',
          answeredAt: '2024-08-08T11:00:00Z',
          tags: ['nodejs', 'database', 'mongodb'],
          upvotes: 12,
          downvotes: 1
        },
        {
          id: '4',
          question: 'Express.js middleware nedir?',
          answer: '',
          askedBy: {
            id: '5',
            firstName: 'Ayşe',
            lastName: 'Özkan',
            email: 'ayse@example.com'
          },
          isAnswered: false,
          isPublic: true,
          createdAt: '2024-08-14T16:45:00Z',
          tags: ['express', 'middleware', 'nodejs'],
          upvotes: 5,
          downvotes: 0
        }
      ]
    },
    {
      id: '3',
      title: 'Python ile Veri Bilimi',
      slug: 'python-ile-veri-bilimi',
      description: 'Python, Pandas ve Scikit-learn ile veri analizi ve makine öğrenmesi.',
      shortDescription: 'Python ile veri bilimi ve ML',
      price: 499.99,
      currency: 'TRY',
      level: 'BEGINNER',
      language: 'tr',
      category: 'Veri Bilimi',
      tags: ['python', 'pandas', 'scikit-learn', 'ml'],
      duration: 1500,
      totalLessons: 58,
      totalSections: 10,
      isPublished: false,
      isActive: true,
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
      previewVideo: 'https://example.com/preview3.mp4',
      requirements: ['Python temelleri', 'Matematik'],
      whatYouWillLearn: ['Pandas', 'NumPy', 'Scikit-learn', 'Veri görselleştirme'],
      createdAt: '2024-03-10T10:00:00Z',
      updatedAt: '2024-08-15T10:00:00Z',
      enrolledStudents: 0,
      completionRate: 0,
      averageRating: 0,
      totalReviews: 0,
      instructor: {
        id: '1',
        firstName: 'Site',
        lastName: 'Sahibi',
        email: 'instructor@lms.com'
      },
      sections: [
        {
          id: '4',
          title: 'Python Temelleri',
          description: 'Python programlama dili temelleri',
          order: 1,
          duration: 180,
          totalLessons: 6,
          isPublished: false,
          lessons: [
            {
              id: '5',
              title: 'Python Kurulumu',
              description: 'Python kurulumu ve ilk program',
              duration: 25,
              order: 1,
              isPublished: false,
              videoUrl: 'https://example.com/videos/python-setup.mp4',
              thumbnail: 'https://example.com/thumbnails/python-setup.jpg',
              videoType: 'VIDEO',
              isFree: true,
              resources: []
            }
          ]
        }
      ],
      qna: [
        {
          id: '5',
          question: 'Python\'da hangi kütüphaneler veri analizi için kullanılır?',
          answer: 'Pandas, NumPy, Matplotlib, Seaborn gibi kütüphaneler veri analizi için yaygın olarak kullanılır.',
          askedBy: {
            id: '6',
            firstName: 'Can',
            lastName: 'Arslan',
            email: 'can@example.com'
          },
          answeredBy: {
            id: '1',
            firstName: 'Site',
            lastName: 'Sahibi',
            email: 'instructor@lms.com'
          },
          isAnswered: true,
          isPublic: true,
          createdAt: '2024-08-05T13:20:00Z',
          answeredAt: '2024-08-05T15:30:00Z',
          tags: ['python', 'pandas', 'numpy', 'data-analysis'],
          upvotes: 18,
          downvotes: 1
        },
        {
          id: '6',
          question: 'Makine öğrenmesi için matematik bilgisi ne kadar gerekli?',
          answer: '',
          askedBy: {
            id: '7',
            firstName: 'Zeynep',
            lastName: 'Yıldız',
            email: 'zeynep@example.com'
          },
          isAnswered: false,
          isPublic: true,
          createdAt: '2024-08-16T10:15:00Z',
          tags: ['machine-learning', 'mathematics', 'python'],
          upvotes: 3,
          downvotes: 0
        }
      ]
    }
  ];

  const getLevelBadge = (level: string) => {
    const badges = {
      BEGINNER: 'bg-green-100 text-green-800',
      INTERMEDIATE: 'bg-yellow-100 text-yellow-800',
      ADVANCED: 'bg-red-100 text-red-800'
    };
    return badges[level as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (isPublished: boolean) => {
    return isPublished 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };



  // Bu fonksiyon artık kullanılmıyor, duration utility'den formatDurationMMSS kullanılıyor

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const openCreateModal = () => {
    setCreateFormData({});
    setFormErrors({});
    setShowCreateModal(true);
  };

  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setEditFormData(course);
    setFormErrors({});
    setShowEditModal(true);
  };

  const openDetailModal = (course: Course) => {
    // Kurs detaylarını API'den getir
    fetchCourseDetails(course.id);
    setShowDetailModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDetailModal(false);
    setShowSectionModal(false);
    setShowLessonModal(false);
    setShowQnAModal(false);
    setSelectedCourse(null);
    setSelectedSection(null);
    setSelectedLesson(null);
    setSelectedQnA(null);
    setEditFormData({});
    setCreateFormData({});
    setSectionFormData({});
    setLessonFormData({});
    setQnaFormData({});
    setFormErrors({});
  };

  const openSectionModal = (section?: CourseSection) => {
    // Eğer section verilmediyse ve selectedCourse yoksa, modal'ı açma
    if (!section && !selectedCourse) {
      alert('Lütfen önce bir kurs seçin!');
      return;
    }

    if (section) {
      setSelectedSection(section);
      setSectionFormData({
        title: section.title,
        description: section.description,
        isPublished: section.isPublished
      });
    } else {
      setSelectedSection(null);
      setSectionFormData({
        title: '',
        description: '',
        order: 1,
        isPublished: false
      });
    }
    setShowSectionModal(true);
  };

  const openLessonModal = (lesson?: CourseLesson, sectionId?: string) => {
    if (lesson) {
      setSelectedLesson(lesson);
      setLessonFormData({
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        isPublished: lesson.isPublished,
        videoUrl: lesson.videoUrl,
        thumbnail: lesson.thumbnail,
        videoType: lesson.videoType,
        isFree: lesson.isFree,
        resources: lesson.resources || []
      });
    } else {
      setSelectedLesson(null);
      setLessonFormData({
        title: '',
        description: '',
        duration: 0,
        isPublished: false,
        videoUrl: '',
        thumbnail: '',
        videoType: 'VIDEO',
        isFree: false,
        resources: []
      });
    }
    
    // Eğer sectionId verildiyse, selectedSection'ı set et
    if (sectionId && !lesson) {
      const section = selectedCourse?.sections?.find(s => s.id === sectionId);
      if (section) {
        setSelectedSection(section);
      }
    }
    
    setShowLessonModal(true);
  };

  const openQnAModal = (qna?: CourseQnA) => {
    if (qna) {
      setSelectedQnA(qna);
      setQnaFormData({
        question: qna.question,
        answer: qna.answer || '',
        isAnswered: qna.isAnswered,
        isPublic: qna.isPublic,
        tags: qna.tags || []
      });
    } else {
      setSelectedQnA(null);
      setQnaFormData({
        question: '',
        answer: '',
        isAnswered: false,
        isPublic: true,
        tags: []
      });
    }
    setShowQnAModal(true);
  };

  const toggleCourseStatus = async (courseId: string, isPublished: boolean) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/courses/${courseId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublished: !isPublished }),
      });

      if (!response.ok) {
        throw new Error('Failed to update course status');
      }

      setCourses(prev => prev && Array.isArray(prev) ? prev.map(course => 
        course.id === courseId 
          ? { ...course, isPublished: !isPublished }
          : course
      ) : []);
    } catch (error) {
      console.error('Failed to update course status:', error);
      alert('Kurs durumu güncellenirken hata oluştu!');
    }
  };





  const filteredCourses = courses && Array.isArray(courses) ? courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.instructor?.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.instructor?.lastName || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && course.isPublished) ||
                         (statusFilter === 'draft' && !course.isPublished);
    
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesLevel && matchesCategory;
  }) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kurs Yönetimi</h1>
          <p className="text-gray-600 mt-2">Sistem kurslarını yönetin, düzenleyin ve izleyin</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Yeni Kurs Ekle
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpenIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Kurs</p>
              <p className="text-2xl font-bold text-gray-900">{courses && Array.isArray(courses) ? courses.length : 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Yayında</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses && Array.isArray(courses) ? courses.filter(c => c.isPublished).length : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taslak</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses && Array.isArray(courses) ? courses.filter(c => !c.isPublished).length : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Öğrenci</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses && Array.isArray(courses) ? courses.reduce((total, c) => total + (c.enrolledStudents || 0), 0) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Kurs ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
          >
            <option value="all" className="text-gray-900 font-medium">Tüm Durumlar</option>
            <option value="published" className="text-gray-900 font-medium">Yayında</option>
            <option value="draft" className="text-gray-900 font-medium">Taslak</option>
          </select>

          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
          >
            <option value="all" className="text-gray-900 font-medium">Tüm Seviyeler</option>
            <option value="BEGINNER" className="text-gray-900 font-medium">Başlangıç</option>
            <option value="INTERMEDIATE" className="text-gray-900 font-medium">Orta</option>
            <option value="ADVANCED" className="text-gray-900 font-medium">İleri</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
          >
            <option value="all" className="text-gray-900 font-medium">Tüm Kategoriler</option>
            <option value="Web Geliştirme" className="text-gray-900 font-medium">Web Geliştirme</option>
            <option value="Backend Geliştirme" className="text-gray-900 font-medium">Backend Geliştirme</option>
            <option value="Veri Bilimi" className="text-gray-900 font-medium">Veri Bilimi</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setLevelFilter('all');
              setCategoryFilter('all');
            }}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 flex items-center justify-center gap-2 font-medium transition-colors bg-white shadow-sm"
          >
            <FunnelIcon className="h-4 w-4" />
            Filtreleri Temizle
          </button>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kurs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eğitmen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seviye
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İstatistikler
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses && Array.isArray(filteredCourses) && filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  {/* Course Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/64x64?text=Kurs';
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {course.title}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {course.shortDescription}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-400">
                            {course.totalSections} bölüm • {course.totalLessons} ders
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatDurationHHMMSS(course.duration || 0)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-400">
                            {formatPrice(course.price, course.currency)}
                          </span>

                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Instructor */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {course.instructor?.firstName || 'N/A'} {course.instructor?.lastName || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">{course.instructor?.email || 'N/A'}</div>
                  </td>

                  {/* Level */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelBadge(course.level)}`}>
                      {course.level === 'BEGINNER' ? 'Başlangıç' : 
                       course.level === 'INTERMEDIATE' ? 'Orta' : 'İleri'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(course.isPublished)}`}>
                      {course.isPublished ? 'Yayında' : 'Taslak'}
                    </span>
                  </td>

                  {/* Statistics */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-gray-600">
                        <UsersIcon className="h-3 w-3 mr-1" />
                        {course.enrolledStudents || 0} öğrenci
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <ChartBarIcon className="h-3 w-3 mr-1" />
                        %{course.completionRate || 0} tamamlanma
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <StarIcon className="h-3 w-3 mr-1" />
                        {(course.averageRating || 0).toFixed(1)} ({(course.totalReviews || 0)} değerlendirme)
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => openDetailModal(course)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded" 
                        title="Görüntüle"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      
                      <button 
                        onClick={() => openEditModal(course)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded" 
                        title="Düzenle"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => toggleCourseStatus(course.id, course.isPublished)}
                        className={`p-1 rounded ${
                          course.isPublished 
                            ? 'text-yellow-600 hover:text-yellow-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                        title={course.isPublished ? 'Taslak Yap' : 'Yayınla'}
                      >
                        {course.isPublished ? <ClockIcon className="h-4 w-4" /> : <CheckCircleIcon className="h-4 w-4" />}
                      </button>



                      <button
                        onClick={() => calculateCourseDuration(course.id)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded" 
                        title="Süreyi Hesapla"
                      >
                        <ClockIcon className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => deleteCourse(course.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded" 
                        title="Sil"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Kurs bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              Arama kriterlerinize uygun kurs bulunamadı.
            </p>
          </div>
        )}
      </div>

      {/* Section Management Modal */}
      {showSectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedSection ? 'Bölüm Düzenle' : 'Yeni Bölüm Ekle'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {selectedSection ? 'Bölüm bilgilerini güncelleyin' : 'Kursa yeni bölüm ekleyin'}
                </p>
              </div>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <form className="space-y-6">
                {/* Section Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Bölüm Başlığı *
                    </label>
                    <input
                      type="text"
                      value={sectionFormData.title || ''}
                      onChange={(e) => setSectionFormData({...sectionFormData, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
                      placeholder="Örn: React Temelleri"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Açıklama
                    </label>
                    <textarea
                      value={sectionFormData.description || ''}
                      onChange={(e) => setSectionFormData({...sectionFormData, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
                      placeholder="Bölüm hakkında kısa açıklama..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Sıra
                    </label>
                    <input
                      type="number"
                      value={sectionFormData.order || 1}
                      onChange={(e) => setSectionFormData({...sectionFormData, order: parseInt(e.target.value) || 1})}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
                      placeholder="1"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={sectionFormData.isPublished || false}
                        onChange={(e) => setSectionFormData({...sectionFormData, isPublished: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Yayında</span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        // Form validation
                        if (!sectionFormData.title?.trim()) {
                          alert('Bölüm başlığı zorunludur!');
                          return;
                        }

                        if (selectedSection) {
                          // Update existing section
                          const response = await fetch(`http://localhost:3001/admin/sections/${selectedSection.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(sectionFormData),
                          });
                          if (!response.ok) throw new Error('Failed to update section');
                        } else {
                          // Create new section
                          if (!selectedCourse?.id) {
                            alert('Kurs bulunamadı!');
                            return;
                          }
                          
                          const response = await fetch(`http://localhost:3001/admin/courses/${selectedCourse.id}/sections`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              ...sectionFormData,
                              order: sectionFormData.order || 1,
                            }),
                          });
                          if (!response.ok) throw new Error('Failed to create section');
                        }
                        
                        // Refresh course data
                        if (selectedCourse) {
                          fetchCourses();
                        }
                        closeModals();
                        alert(selectedSection ? 'Bölüm güncellendi!' : 'Bölüm eklendi!');
                      } catch (error) {
                        console.error('Section operation failed:', error);
                        alert('İşlem başarısız! Lütfen tekrar deneyin.');
                      }
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {selectedSection ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Management Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedLesson ? 'Ders Düzenle' : 'Yeni Ders Ekle'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {selectedLesson ? 'Ders bilgilerini güncelleyin' : 'Bölüme yeni ders ekleyin'}
                </p>
              </div>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <form className="space-y-6">
                {/* Lesson Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Ders Başlığı *
                    </label>
                    <input
                      type="text"
                      value={lessonFormData.title || ''}
                      onChange={(e) => setLessonFormData({...lessonFormData, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
                      placeholder="Örn: React Nedir?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Ders Tipi
                    </label>
                    <select
                      value={lessonFormData.videoType || 'VIDEO'}
                      onChange={(e) => setLessonFormData({...lessonFormData, videoType: e.target.value as any})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
                    >
                      <option value="VIDEO">Video</option>
                      <option value="LIVE">Canlı Yayın</option>
                      <option value="QUIZ">Quiz</option>
                      <option value="ASSIGNMENT">Ödev</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={lessonFormData.description || ''}
                    onChange={(e) => setLessonFormData({...lessonFormData, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
                    placeholder="Ders hakkında detaylı açıklama..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Süre (dakika)
                    </label>
                    <div className="space-y-2">
                      <input
                        type="number"
                        value={lessonFormData.duration || 0}
                        onChange={(e) => setLessonFormData({...lessonFormData, duration: parseInt(e.target.value) || 0})}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
                        placeholder="Video süresi otomatik alınacak"
                      />
                      <div className="text-xs text-gray-500">
                        💡 Video URL'ini girdikten sonra "Süreyi Otomatik Al" butonuna tıklayın
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={lessonFormData.isFree || false}
                        onChange={(e) => setLessonFormData({...lessonFormData, isFree: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Ücretsiz</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Video URL *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={lessonFormData.videoUrl || ''}
                      onChange={(e) => setLessonFormData({...lessonFormData, videoUrl: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
                      placeholder="https://example.com/video.mp4"
                    />
                    {lessonFormData.videoUrl && (
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const response = await fetch('http://localhost:3001/admin/video/duration', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ videoUrl: lessonFormData.videoUrl }),
                              });
                              
                              if (response.ok) {
                                const data = await response.json();
                                setLessonFormData(prev => ({ ...prev, duration: data.duration }));
                                alert(`Video süresi otomatik olarak alındı: ${data.formattedDuration} (${data.duration} saniye)`);
                              } else {
                                throw new Error('Failed to get video duration');
                              }
                            } catch (error) {
                              console.error('Error getting video duration:', error);
                              alert('Video süresi alınamadı. Manuel olarak girebilirsiniz.');
                            }
                          }}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          🎬 Süreyi Otomatik Al
                        </button>
                        <span className="text-xs text-gray-500">
                          Video URL'ini girdikten sonra süreyi otomatik olarak alabilirsiniz
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={lessonFormData.thumbnail || ''}
                    onChange={(e) => setLessonFormData({...lessonFormData, thumbnail: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Ek Kaynaklar (her satıra bir URL)
                  </label>
                  <textarea
                    value={(lessonFormData.resources || []).join('\n')}
                    onChange={(e) => setLessonFormData({
                      ...lessonFormData, 
                      resources: e.target.value.split('\n').filter(url => url.trim())
                    })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
                    placeholder="https://example.com/resource1.pdf&#10;https://example.com/resource2.zip"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={lessonFormData.isPublished || false}
                      onChange={(e) => setLessonFormData({...lessonFormData, isPublished: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Yayında</span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        // Form validation
                        if (!lessonFormData.title?.trim()) {
                          alert('Ders başlığı zorunludur!');
                          return;
                        }
                        if (!lessonFormData.videoUrl?.trim()) {
                          alert('Video URL zorunludur!');
                          return;
                        }

                        if (selectedLesson) {
                          // Update existing lesson
                          const response = await fetch(`http://localhost:3001/admin/lessons/${selectedLesson.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(lessonFormData),
                          });
                          if (!response.ok) throw new Error('Failed to update lesson');
                        } else {
                          // Create new lesson - need section ID from context
                          let sectionId = '';
                          
                          // If we're adding to a specific section (from section context)
                          if (selectedSection?.id) {
                            sectionId = selectedSection.id;
                          } else {
                            // If we're adding to the first available section
                            const firstSection = selectedCourse?.sections?.[0];
                            if (firstSection?.id) {
                              sectionId = firstSection.id;
                            } else {
                              alert('Önce bir bölüm oluşturmanız gerekiyor!');
                              return;
                            }
                          }
                          
                          const response = await fetch(`http://localhost:3001/admin/sections/${sectionId}/lessons`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              ...lessonFormData,
                              order: 1, // Default order
                            }),
                          });
                          if (!response.ok) throw new Error('Failed to create lesson');
                        }
                        
                        // Refresh course data
                        if (selectedCourse) {
                          fetchCourses();
                          
                          // Kurs süresini otomatik olarak hesapla
                          setTimeout(() => {
                            calculateCourseDuration(selectedCourse.id);
                          }, 1000);
                        }
                        closeModals();
                        alert(selectedLesson ? 'Ders güncellendi!' : 'Ders eklendi! Kurs süresi otomatik olarak güncelleniyor...');
                      } catch (error) {
                        console.error('Lesson operation failed:', error);
                        alert('İşlem başarısız! Lütfen tekrar deneyin.');
                      }
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {selectedLesson ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Q&A Management Modal */}
      {showQnAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedQnA ? 'Soru Düzenle' : 'Yeni Soru Ekle'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {selectedQnA ? 'Soru bilgilerini güncelleyin' : 'Kursa yeni soru ekleyin'}
                </p>
              </div>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <form className="space-y-6">
                {/* Question Information */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Soru *
                  </label>
                  <textarea
                    value={qnaFormData.question || ''}
                    onChange={(e) => setQnaFormData({...qnaFormData, question: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
                    placeholder="Sorunuzu detaylı bir şekilde yazın..."
                  />
                </div>

                {/* Answer */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Cevap
                  </label>
                  <textarea
                    value={qnaFormData.answer || ''}
                    onChange={(e) => setQnaFormData({...qnaFormData, answer: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
                    placeholder="Sorunun cevabını yazın..."
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Etiketler (virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    value={(qnaFormData.tags || []).join(', ')}
                    onChange={(e) => setQnaFormData({
                      ...qnaFormData, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors"
                    placeholder="react, hooks, state"
                  />
                </div>

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={qnaFormData.isAnswered || false}
                        onChange={(e) => setQnaFormData({...qnaFormData, isAnswered: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Cevaplandı</span>
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={qnaFormData.isPublic || false}
                        onChange={(e) => setQnaFormData({...qnaFormData, isPublic: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Herkese Açık</span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        if (selectedQnA) {
                          // Update existing Q&A
                          const response = await fetch(`http://localhost:3001/admin/qna/${selectedQnA.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(qnaFormData),
                          });
                          if (!response.ok) throw new Error('Failed to update Q&A');
                        } else {
                          // Create new Q&A
                          const response = await fetch(`http://localhost:3001/admin/courses/${selectedCourse?.id}/qna`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              ...qnaFormData,
                              askedBy: { id: '1', firstName: 'Admin', lastName: 'User', email: 'admin@lms.com' },
                              upvotes: 0,
                              downvotes: 0,
                            }),
                          });
                          if (!response.ok) throw new Error('Failed to create Q&A');
                        }
                        
                        // Refresh course data
                        if (selectedCourse) {
                          fetchCourses();
                        }
                        closeModals();
                        alert(selectedQnA ? 'Soru güncellendi!' : 'Soru eklendi!');
                      } catch (error) {
                        console.error('Q&A operation failed:', error);
                        alert('İşlem başarısız! Lütfen tekrar deneyin.');
                      }
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {selectedQnA ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TODO: Add Course Create Modal */}
      {/* TODO: Add Course Edit Modal */}
      {/* TODO: Add Course Detail Modal */}

      {/* Course Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9997]">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Yeni Kurs Ekle</h2>
                <p className="text-gray-600 mt-1">Sisteme yeni kurs ekleyin</p>
              </div>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <form className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Kurs Adı *
                    </label>
                    <input
                      type="text"
                      value={createFormData.title || ''}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium hover:border-gray-400"
                      placeholder="Kurs adını girin"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Kısa Açıklama *
                    </label>
                    <input
                      type="text"
                      value={createFormData.shortDescription || ''}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium hover:border-gray-400"
                      placeholder="Kısa açıklama girin"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Detaylı Açıklama *
                  </label>
                  <textarea
                    value={createFormData.description || ''}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium hover:border-gray-400 resize-none"
                    placeholder="Kurs hakkında detaylı açıklama girin"
                  />
                </div>

                {/* Course Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Seviye *
                    </label>
                    <select
                      value={createFormData.level || ''}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, level: e.target.value as any }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium hover:border-gray-400"
                    >
                      <option value="" className="text-gray-900 font-medium">Seviye seçin</option>
                      <option value="BEGINNER" className="text-gray-900 font-medium">Başlangıç</option>
                      <option value="INTERMEDIATE" className="text-gray-900 font-medium">Orta</option>
                      <option value="ADVANCED" className="text-gray-900 font-medium">İleri</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Kategori *
                    </label>
                    <select
                      value={createFormData.category || ''}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium hover:border-gray-400"
                    >
                      <option value="" className="text-gray-900 font-medium">Kategori seçin</option>
                      <option value="Web Geliştirme" className="text-gray-900 font-medium">Web Geliştirme</option>
                      <option value="Backend Geliştirme" className="text-gray-900 font-medium">Backend Geliştirme</option>
                      <option value="Veri Bilimi" className="text-gray-900 font-medium">Veri Bilimi</option>
                      <option value="Mobil Geliştirme" className="text-gray-900 font-medium">Mobil Geliştirme</option>
                      <option value="DevOps" className="text-gray-900 font-medium">DevOps</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Dil *
                    </label>
                    <select
                      value={createFormData.language || ''}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium hover:border-gray-400"
                    >
                      <option value="" className="text-gray-900 font-medium">Dil seçin</option>
                      <option value="tr" className="text-gray-900 font-medium">Türkçe</option>
                      <option value="en" className="text-gray-900 font-medium">İngilizce</option>
                    </select>
                  </div>
                </div>

                {/* Price and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Fiyat *
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={createFormData.price || ''}
                          onChange={(e) => setCreateFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium hover:border-gray-400"
                          placeholder="0.00"
                        />
                        <select
                          value={createFormData.currency || 'TRY'}
                          onChange={(e) => setCreateFormData(prev => ({ ...prev, currency: e.target.value }))}
                          className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium hover:border-gray-400"
                        >
                          <option value="TRY" className="text-gray-900 font-medium">₺</option>
                          <option value="USD" className="text-gray-900 font-medium">$</option>
                          <option value="EUR" className="text-gray-900 font-medium">€</option>
                        </select>
                      </div>
                      
                      {/* KDV Seçenekleri */}
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="taxIncluded"
                            value="included"
                            checked={createFormData.taxIncluded === 'included'}
                            onChange={(e) => setCreateFormData(prev => ({ ...prev, taxIncluded: e.target.value }))}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">KDV Dahil</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="taxIncluded"
                            value="excluded"
                            checked={createFormData.taxIncluded === 'excluded'}
                            onChange={(e) => setCreateFormData(prev => ({ ...prev, taxIncluded: e.target.value }))}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">KDV Hariç</span>
                        </label>
                      </div>
                      
                      {/* Fiyat Özeti */}
                      {createFormData.price && createFormData.price > 0 && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex justify-between">
                              <span>Net Fiyat:</span>
                              <span className="font-medium">
                                {createFormData.taxIncluded === 'included' 
                                  ? `${(createFormData.price / (1 + taxSettings.taxRate / 100)).toFixed(2)} ${createFormData.currency}`
                                  : `${createFormData.price} ${createFormData.currency}`
                                }
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>KDV (%{taxSettings.taxRate}):</span>
                              <span className="font-medium">
                                {createFormData.taxIncluded === 'included'
                                  ? `${(createFormData.price - (createFormData.price / (1 + taxSettings.taxRate / 100))).toFixed(2)} ${createFormData.currency}`
                                  : `${(createFormData.price * (taxSettings.taxRate / 100)).toFixed(2)} ${createFormData.currency}`
                                }
                              </span>
                            </div>
                            <div className="flex justify-between border-t pt-1">
                              <span className="font-semibold">Satış Fiyatı:</span>
                              <span className="font-bold text-blue-600">
                                {createFormData.taxIncluded === 'included'
                                  ? `${createFormData.price} ${createFormData.currency}`
                                  : `${(createFormData.price * (1 + taxSettings.taxRate / 100)).toFixed(2)} ${createFormData.currency}`
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Kurs Süresi
                    </label>
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-2">📚 Otomatik Süre Hesaplama</p>
                          <p>Kurs süresi, eklenen derslerin toplam süresine göre otomatik hesaplanacaktır.</p>
                          <p className="mt-2 text-xs">💡 Video yüklenen derslerde süre otomatik olarak çekilecektir.</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Toplam Süre:</span>
                            <span className="font-medium text-blue-600">
                              {createFormData.duration || 0} dakika
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Toplam Süre:</span>
                            <span className="font-medium text-blue-600">
                              {formatDurationHHMMSS(createFormData.duration || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thumbnail and Preview Video */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Thumbnail URL
                    </label>
                    <input
                      type="url"
                      value={createFormData.thumbnail || ''}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium hover:border-gray-400"
                      placeholder="https://example.com/thumbnail.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Preview Video URL
                    </label>
                    <input
                      type="url"
                      value={createFormData.previewVideo || ''}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, previewVideo: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium hover:border-gray-400"
                      placeholder="https://example.com/preview.mp4"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Etiketler (virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    value={createFormData.tags?.join(', ') || ''}
                    onChange={(e) => setCreateFormData(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium hover:border-gray-400"
                    placeholder="react, typescript, web, frontend"
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Gereksinimler (her satıra bir tane)
                  </label>
                  <textarea
                    value={createFormData.requirements?.join('\n') || ''}
                    onChange={(e) => setCreateFormData(prev => ({ 
                      ...prev, 
                      requirements: e.target.value.split('\n').map(req => req.trim()).filter(req => req)
                    }))}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium hover:border-gray-400 resize-none"
                    placeholder="HTML temelleri\nCSS temelleri\nJavaScript temelleri"
                  />
                </div>

                {/* What You Will Learn */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Ne Öğreneceksiniz (her satıra bir tane)
                  </label>
                  <textarea
                    value={createFormData.whatYouWillLearn?.join('\n') || ''}
                    onChange={(e) => setCreateFormData(prev => ({ 
                      ...prev, 
                      whatYouWillLearn: e.target.value.split('\n').map(learn => learn.trim()).filter(learn => learn)
                    }))}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium hover:border-gray-400 resize-none"
                    placeholder="React Hooks kullanımı\nTypeScript ile tip güvenliği\nModern JavaScript özellikleri"
                  />
                </div>

                {/* Initial Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={createFormData.isPublished || false}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublished" className="ml-2 block text-sm font-medium text-gray-900">
                      Hemen Yayınla
                    </label>
                  </div>



                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={createFormData.isActive !== false}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm font-medium text-gray-900">
                      Aktif
                    </label>
                  </div>
                </div>
              </form>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement course creation
                    alert('Kurs oluşturma özelliği yakında eklenecek!');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Kurs Oluştur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Edit Modal */}
      {showEditModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9997]">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Kurs Düzenle</h2>
                <p className="text-gray-600 mt-1">{selectedCourse.title}</p>
              </div>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <form className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Kurs Adı *
                    </label>
                    <input
                      type="text"
                      value={editFormData.title || selectedCourse.title}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium hover:border-gray-400"
                      placeholder="Kurs adını girin"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Kısa Açıklama *
                    </label>
                    <input
                      type="text"
                      value={editFormData.shortDescription || selectedCourse.shortDescription || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium hover:border-gray-400"
                      placeholder="Kısa açıklama girin"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Detaylı Açıklama *
                  </label>
                  <textarea
                    value={editFormData.description || selectedCourse.description}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium hover:border-gray-400 resize-none"
                    placeholder="Kurs hakkında detaylı açıklama girin"
                  />
                </div>

                {/* Course Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Seviye *
                    </label>
                    <select
                      value={editFormData.level || selectedCourse.level}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, level: e.target.value as any }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium hover:border-gray-400"
                    >
                      <option value="BEGINNER" className="text-gray-900 font-medium">Başlangıç</option>
                      <option value="INTERMEDIATE" className="text-gray-900 font-medium">Orta</option>
                      <option value="ADVANCED" className="text-gray-900 font-medium">İleri</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Kategori *
                    </label>
                    <select
                      value={editFormData.category || selectedCourse.category || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium hover:border-gray-400"
                    >
                      <option value="Web Geliştirme" className="text-gray-900 font-medium">Web Geliştirme</option>
                      <option value="Backend Geliştirme" className="text-gray-900 font-medium">Backend Geliştirme</option>
                      <option value="Veri Bilimi" className="text-gray-900 font-medium">Veri Bilimi</option>
                      <option value="Mobil Geliştirme" className="text-gray-900 font-medium">Mobil Geliştirme</option>
                      <option value="DevOps" className="text-gray-900 font-medium">DevOps</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Dil *
                    </label>
                    <select
                      value={editFormData.language || selectedCourse.language}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium hover:border-gray-400"
                    >
                      <option value="tr" className="text-gray-900 font-medium">Türkçe</option>
                      <option value="en" className="text-gray-900 font-medium">İngilizce</option>
                    </select>
                  </div>
                </div>

                {/* Price and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Fiyat (TRY) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editFormData.price || selectedCourse.price}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium hover:border-gray-400"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Toplam Süre (dakika) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editFormData.duration || selectedCourse.duration}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium hover:border-gray-400"
                      placeholder="120"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Para Birimi
                    </label>
                    <select
                      value={editFormData.currency || selectedCourse.currency}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium hover:border-gray-400"
                    >
                      <option value="TRY" className="text-gray-900 font-medium">TRY (₺)</option>
                      <option value="USD" className="text-gray-900 font-medium">USD ($)</option>
                      <option value="EUR" className="text-gray-900 font-medium">EUR (€)</option>
                    </select>
                  </div>
                </div>

                {/* Thumbnail and Preview Video */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Thumbnail URL
                    </label>
                    <input
                      type="url"
                      value={editFormData.thumbnail || selectedCourse.thumbnail || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium hover:border-gray-400"
                      placeholder="https://example.com/thumbnail.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Preview Video URL
                    </label>
                    <input
                      type="url"
                      value={editFormData.previewVideo || selectedCourse.previewVideo || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, previewVideo: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium hover:border-gray-400"
                      placeholder="https://example.com/preview.mp4"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Etiketler (virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    value={editFormData.tags?.join(', ') || selectedCourse.tags?.join(', ') || ''}
                    onChange={(e) => setEditFormData(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium hover:border-gray-400"
                    placeholder="react, typescript, web, frontend"
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Gereksinimler (her satıra bir tane)
                  </label>
                  <textarea
                    value={editFormData.requirements?.join('\n') || selectedCourse.requirements?.join('\n') || ''}
                    onChange={(e) => setEditFormData(prev => ({ 
                      ...prev, 
                      requirements: e.target.value.split('\n').map(req => req.trim()).filter(req => req)
                    }))}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium hover:border-gray-400 resize-none"
                    placeholder="HTML temelleri\nCSS temelleri\nJavaScript temelleri"
                  />
                </div>

                {/* What You Will Learn */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Ne Öğreneceksiniz (her satıra bir tane)
                  </label>
                  <textarea
                    value={editFormData.whatYouWillLearn?.join('\n') || selectedCourse.whatYouWillLearn?.join('\n') || ''}
                    onChange={(e) => setEditFormData(prev => ({ 
                      ...prev, 
                      whatYouWillLearn: e.target.value.split('\n').map(learn => learn.trim()).filter(learn => learn)
                    }))}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium hover:border-gray-400 resize-none"
                    placeholder="React Hooks kullanımı\nTypeScript ile tip güvenliği\nModern JavaScript özellikleri"
                  />
                </div>

                {/* Course Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="editIsPublished"
                      checked={editFormData.isPublished !== undefined ? editFormData.isPublished : selectedCourse.isPublished}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="editIsPublished" className="ml-2 block text-sm font-medium text-gray-900">
                      Yayında
                    </label>
                  </div>



                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="editIsActive"
                      checked={editFormData.isActive !== undefined ? editFormData.isActive : selectedCourse.isActive}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="editIsActive" className="ml-2 block text-sm font-medium text-gray-900">
                      Aktif
                    </label>
                  </div>
                </div>
              </form>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement course update
                    alert('Kurs güncelleme özelliği yakında eklenecek!');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Detail Modal */}
      {showDetailModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9998]">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Kurs Detayları</h2>
                <p className="text-gray-600 mt-1">{selectedCourse.title}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowEditModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Düzenle
                </button>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-8">
              {/* Course Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Basic Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Thumbnail */}
                  {selectedCourse.thumbnail && (
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={selectedCourse.thumbnail}
                        alt={selectedCourse.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Kurs Bilgileri</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Seviye</span>
                        <p className="text-sm text-gray-900 capitalize">{selectedCourse.level?.toLowerCase()}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Kategori</span>
                        <p className="text-sm text-gray-900">{selectedCourse.category || 'Belirtilmemiş'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Dil</span>
                        <p className="text-sm text-gray-900">{selectedCourse.language === 'tr' ? 'Türkçe' : 'İngilizce'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Süre</span>
                        <p className="text-sm text-gray-900">
                      {(() => {
                        const duration = calculateCourseDurationManually(selectedCourse);
                        return formatDuration(duration.totalDuration || 0);
                      })()}
                    </p>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-500">Açıklama</span>
                      <p className="text-sm text-gray-900 mt-1">{selectedCourse.description}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedCourse.tags && Array.isArray(selectedCourse.tags) && selectedCourse.tags.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Etiketler</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedCourse.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Requirements */}
                  {selectedCourse.requirements && Array.isArray(selectedCourse.requirements) && selectedCourse.requirements.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Gereksinimler</span>
                      <ul className="mt-2 space-y-1">
                        {selectedCourse.requirements.map((req, index) => (
                          <li key={index} className="text-sm text-gray-900 flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* What You Will Learn */}
                  {selectedCourse.whatYouWillLearn && Array.isArray(selectedCourse.whatYouWillLearn) && selectedCourse.whatYouWillLearn.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Ne Öğreneceksiniz</span>
                      <ul className="mt-2 space-y-1">
                        {selectedCourse.whatYouWillLearn.map((learn, index) => (
                          <li key={index} className="text-sm text-gray-900 flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            {learn}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right Column - Stats & Actions */}
                <div className="space-y-6">
                  {/* Course Stats */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Kurs İstatistikleri</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedCourse.sections?.length || 0}</div>
                        <div className="text-sm text-gray-600">Bölüm</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedCourse.sections && Array.isArray(selectedCourse.sections) 
                            ? selectedCourse.sections.reduce((total, section) => 
                                total + (section.lessons && Array.isArray(section.lessons) ? section.lessons.length : 0), 0)
                            : 0}
                        </div>
                        <div className="text-sm text-gray-600">Ders</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Fiyat:</span>
                        <span className="font-medium text-gray-900">{selectedCourse.price} {selectedCourse.currency}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Durum:</span>
                        <span className={`font-medium ${selectedCourse.isPublished ? 'text-green-600' : 'text-yellow-600'}`}>
                          {selectedCourse.isPublished ? 'Yayında' : 'Taslak'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Aktif:</span>
                        <span className={`font-medium ${selectedCourse.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedCourse.isActive ? 'Evet' : 'Hayır'}
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Hızlı İşlemler</h3>
                    
                    <button
                      onClick={() => {
                        // TODO: Toggle publish status
                        alert('Yayın durumu değiştirme özelliği yakında eklenecek!');
                      }}
                      className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedCourse.isPublished
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {selectedCourse.isPublished ? 'Yayından Kaldır' : 'Yayınla'}
                    </button>



                    <button
                      onClick={() => {
                        // TODO: Toggle active status
                        alert('Aktiflik durumu değiştirme özelliği yakında eklenecek!');
                      }}
                      className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedCourse.isActive
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {selectedCourse.isActive ? 'Deaktif Et' : 'Aktif Et'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Course Content - Sections & Lessons */}
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Kurs İçeriği</h3>
                                      <button
                      onClick={() => openSectionModal()}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Yeni Bölüm Ekle
                    </button>
                </div>

                {/* Sections List with Drag & Drop */}
                <SortableContainer
                  sections={selectedCourse.sections || []}
                  onSectionsReorder={handleSectionsReorder}
                  onLessonsReorder={handleLessonsReorder}
                >
                  <div className="space-y-4">
                    {selectedCourse.sections && Array.isArray(selectedCourse.sections) && selectedCourse.sections.length > 0 ? (
                      selectedCourse.sections.map((section, sectionIndex) => (
                        <SortableSection
                          key={section.id}
                          section={section}
                          sectionIndex={sectionIndex}
                          onEdit={openSectionModal}
                          onAddLesson={openLessonModal}
                          onLessonsReorder={handleLessonsReorder}
                        >
                          {/* Section Description */}
                          {section.description && (
                            <div className="p-4 border-b border-gray-200">
                              <p className="text-sm text-gray-600">{section.description}</p>
                            </div>
                          )}

                          {/* Lessons List */}
                          <div className="p-4">
                            {section.lessons && Array.isArray(section.lessons) && section.lessons.length > 0 ? (
                              <div className="space-y-3">
                                {section.lessons.map((lesson, lessonIndex) => (
                                  <SortableLesson
                                    key={lesson.id}
                                    lesson={lesson}
                                    lessonIndex={lessonIndex}
                                    onEdit={openLessonModal}
                                    onDelete={deleteLesson}
                                  />
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-gray-500">
                                <DocumentTextIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                <p>Bu bölümde henüz ders bulunmuyor</p>
                                <button
                                  onClick={() => openLessonModal(undefined, section.id)}
                                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                  İlk Dersi Ekle
                                </button>
                              </div>
                            )}
                          </div>
                        </SortableSection>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <DocumentTextIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium mb-2">Henüz bölüm bulunmuyor</p>
                        <p className="text-sm mb-4">Kursa ilk bölümü ekleyerek başlayın</p>
                        <button
                          onClick={() => openSectionModal()}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          <PlusIcon className="h-5 w-5 mr-2" />
                          İlk Bölümü Ekle
                        </button>
                      </div>
                    )}
                  </div>
                </SortableContainer>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}
