'use client';

import { XMarkIcon, ClockIcon, BookOpenIcon, TagIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface CourseData {
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
  featured: boolean;
  thumbnail: string;
  previewVideo: string;
  requirements: string[];
  whatYouWillLearn: string[];
  createdAt: string;
  updatedAt: string;
}

interface CourseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseData | null;
}

const levelLabels = {
  BEGINNER: 'Başlangıç',
  INTERMEDIATE: 'Orta',
  ADVANCED: 'İleri'
};

const levelColors = {
  BEGINNER: 'bg-green-100 text-green-800',
  INTERMEDIATE: 'bg-yellow-100 text-yellow-800',
  ADVANCED: 'bg-red-100 text-red-800'
};

export default function CourseDetailModal({ isOpen, onClose, course }: CourseDetailModalProps) {
  if (!isOpen || !course) return null;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} saat ${mins > 0 ? `${mins} dakika` : ''}`.trim();
    }
    return `${mins} dakika`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Kurs Detayları</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Course Header */}
          <div className="flex items-start gap-6">
            {/* Thumbnail */}
            <div className="w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              {course.thumbnail ? (
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500">Thumbnail Yok</span>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.shortDescription}</p>
              
              <div className="flex flex-wrap gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${levelColors[course.level]}`}>
                  {levelLabels[course.level]}
                </span>
                <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {course.language}
                </span>
                <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                  {course.category}
                </span>
                {course.featured && (
                  <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                    Öne Çıkan
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-sm ${course.isPublished ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                  {course.isPublished ? 'Yayında' : 'Taslak'}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <ClockIcon className="h-6 w-6 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatDuration(course.duration)}</p>
              <p className="text-sm text-gray-600">Toplam Süre</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <BookOpenIcon className="h-6 w-6 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{course.totalSections}</p>
              <p className="text-sm text-gray-600">Bölüm</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <BookOpenIcon className="h-6 w-6 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{course.totalLessons}</p>
              <p className="text-sm text-gray-600">Ders</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl">💰</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{course.price}</p>
              <p className="text-sm text-gray-600">{course.currency}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Açıklama</h3>
            <p className="text-gray-700 leading-relaxed">{course.description}</p>
          </div>

          {/* Tags */}
          {course.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <TagIcon className="h-5 w-5 mr-2" />
                Etiketler
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {course.requirements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                Gereksinimler
              </h3>
              <ul className="space-y-2">
                {course.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* What You Will Learn */}
          {course.whatYouWillLearn.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Neler Öğreneceksiniz
              </h3>
              <ul className="space-y-2">
                {course.whatYouWillLearn.map((learning, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">{learning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Media */}
          {(course.thumbnail || course.previewVideo) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Medya</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.thumbnail && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Thumbnail</p>
                    <img 
                      src={course.thumbnail} 
                      alt="Thumbnail"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                {course.previewVideo && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Önizleme Video</p>
                    <video 
                      controls 
                      className="w-full h-32 object-cover rounded-lg"
                    >
                      <source src={course.previewVideo} type="video/mp4" />
                      Tarayıcınız video oynatmayı desteklemiyor.
                    </video>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Meta Bilgiler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">URL Slug:</p>
                <p className="font-mono text-gray-900">{course.slug}</p>
              </div>
              <div>
                <p className="text-gray-600">Oluşturulma:</p>
                <p className="text-gray-900">{formatDate(course.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-600">Son Güncelleme:</p>
                <p className="text-gray-900">{formatDate(course.updatedAt)}</p>
              </div>
              <div>
                <p className="text-gray-600">Durum:</p>
                <p className="text-gray-900">
                  {course.isActive ? 'Aktif' : 'Pasif'} / {course.isPublished ? 'Yayında' : 'Taslak'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
