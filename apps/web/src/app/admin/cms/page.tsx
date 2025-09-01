'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  BookOpenIcon, 
  VideoCameraIcon, 
  DocumentTextIcon, 
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  PhotoIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  FlagIcon
} from '@heroicons/react/24/outline';

interface VideoNote {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  timestamp: number; // saniye
  note: string;
  isPublic: boolean;
  createdAt: string;
  isFlagged?: boolean;
}

interface Question {
  id: string;
  courseId: string;
  lessonId: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  images: string[];
  isResolved: boolean;
  createdAt: string;
  answers: Answer[];
  isFlagged?: boolean;
}

interface Answer {
  id: string;
  questionId: string;
  userId: string;
  userName: string;
  content: string;
  images: string[];
  isAccepted: boolean;
  createdAt: string;
  isFlagged?: boolean;
}

interface CourseContent {
  id: string;
  courseId: string;
  lessonId: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  title: string;
  description: string;
  content: any;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState('content');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedLesson, setSelectedLesson] = useState<string>('');
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [showEditContentModal, setShowEditContentModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<CourseContent | null>(null);

  // Mock data
  const courses = [
    { id: '1', title: 'Web Geliştirme Temelleri', slug: 'web-gelistirme' },
    { id: '2', title: 'React ile Modern Uygulamalar', slug: 'react-modern' },
    { id: '3', title: 'Node.js Backend Geliştirme', slug: 'nodejs-backend' }
  ];

  const lessons = [
    { id: '1', courseId: '1', title: 'HTML Temelleri', order: 1 },
    { id: '2', courseId: '1', title: 'CSS Styling', order: 2 },
    { id: '3', courseId: '1', title: 'JavaScript Basics', order: 3 }
  ];

  const videoNotes: VideoNote[] = [
    {
      id: '1',
      videoId: 'video1',
      userId: 'user1',
      userName: 'Ahmet Yılmaz',
      timestamp: 45,
      note: 'Bu kısımda CSS grid sistemini çok iyi açıklıyor',
      isPublic: true,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      videoId: 'video1',
      userId: 'user2',
      userName: 'Fatma Demir',
      timestamp: 120,
      note: 'Flexbox özelliklerini not aldım',
      isPublic: false,
      createdAt: '2024-01-15T11:15:00Z'
    },
    {
      id: '3',
      videoId: 'video2',
      userId: 'user3',
      userName: 'Mehmet Kaya',
      timestamp: 300,
      note: 'Bu video çok uzun, kısaltılabilir',
      isPublic: true,
      createdAt: '2024-01-15T12:00:00Z',
      isFlagged: true
    }
  ];

  const questions: Question[] = [
    {
      id: '1',
      courseId: '1',
      lessonId: '1',
      userId: 'user1',
      userName: 'Mehmet Kaya',
      title: 'CSS Grid ile responsive tasarım nasıl yapılır?',
      content: 'CSS Grid kullanarak mobil uyumlu bir layout oluşturmaya çalışıyorum ama sütunlar düzgün sıralanmıyor.',
      images: ['https://example.com/screenshot1.png'],
      isResolved: false,
      createdAt: '2024-01-14T09:00:00Z',
      answers: [
        {
          id: '1',
          questionId: '1',
          userId: 'user3',
          userName: 'Ali Veli',
          content: 'Grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) kullanabilirsin.',
          images: [],
          isAccepted: false,
          createdAt: '2024-01-14T10:30:00Z'
        }
      ]
    },
    {
      id: '2',
      courseId: '1',
      lessonId: '2',
      userId: 'user4',
      userName: 'Ayşe Demir',
      title: 'CSS Flexbox vs Grid ne zaman kullanılır?',
      content: 'Hangi durumda Flexbox, hangi durumda Grid kullanmam gerekiyor?',
      images: [],
      isResolved: true,
      createdAt: '2024-01-13T14:00:00Z',
      answers: [
        {
          id: '2',
          questionId: '2',
          userId: 'user5',
          userName: 'Can Özkan',
          content: 'Flexbox tek boyutlu layout için, Grid iki boyutlu layout için kullanılır.',
          images: [],
          isAccepted: true,
          createdAt: '2024-01-13T15:30:00Z'
        }
      ]
    }
  ];

  const courseContents: CourseContent[] = [
    {
      id: '1',
      courseId: '1',
      lessonId: '1',
      type: 'video',
      title: 'HTML Temelleri Video',
      description: 'HTML yapısı ve temel etiketler',
      content: { videoUrl: 'https://example.com/video1.mp4', duration: 1800 },
      isPublished: true,
      order: 1,
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z'
    },
    {
      id: '2',
      courseId: '1',
      lessonId: '1',
      type: 'document',
      title: 'HTML Cheat Sheet',
      description: 'Sık kullanılan HTML etiketleri',
      content: { fileUrl: 'https://example.com/html-cheatsheet.pdf' },
      isPublished: true,
      order: 2,
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z'
    },
    {
      id: '3',
      courseId: '1',
      lessonId: '2',
      type: 'quiz',
      title: 'CSS Temel Bilgiler Testi',
      description: 'CSS hakkında 10 soruluk test',
      content: { questionCount: 10, timeLimit: 600 },
      isPublished: false,
      order: 1,
      createdAt: '2024-01-12T00:00:00Z',
      updatedAt: '2024-01-12T00:00:00Z'
    }
  ];

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddContent = () => {
    setShowAddContentModal(true);
  };

  const handleEditContent = (content: CourseContent) => {
    setSelectedContent(content);
    setShowEditContentModal(true);
  };

  const handleTogglePublish = (contentId: string) => {
    // Toggle publish status logic
    console.log('Toggle publish for:', contentId);
  };

  const handleDeleteContent = (contentId: string) => {
    if (confirm('Bu içeriği silmek istediğinizden emin misiniz?')) {
      console.log('Delete content:', contentId);
    }
  };

  const handleModerateNote = (noteId: string, action: 'approve' | 'reject' | 'flag') => {
    console.log('Moderate note:', noteId, action);
  };

  const handleModerateQuestion = (questionId: string, action: 'approve' | 'reject' | 'flag') => {
    console.log('Moderate question:', questionId, action);
  };

  const handleAnswerQuestion = (questionId: string) => {
    console.log('Answer question:', questionId);
  };

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">İçerik Yönetim Sistemi</h1>
                <p className="text-gray-600 mt-2">Kurs içerikleri, öğrenci aktiviteleri ve sistem yönetimi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Kurs ve Ders Seçimi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kurs Seçin
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Kurs seçin...</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ders Seçin
              </label>
              <select
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!selectedCourse}
              >
                <option value="">Ders seçin...</option>
                {lessons
                  .filter(lesson => lesson.courseId === selectedCourse)
                  .map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.order}. {lesson.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('content')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'content'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpenIcon className="h-5 w-5" />
                  İçerik Yönetimi
                </div>
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'notes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <DocumentTextIcon className="h-5 w-5" />
                  Öğrenci Notları
                  {videoNotes.filter(n => n.isFlagged).length > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      {videoNotes.filter(n => n.isFlagged).length}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('qa')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'qa'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <QuestionMarkCircleIcon className="h-5 w-5" />
                  Soru-Cevap Forumu
                  {questions.filter(q => q.isFlagged).length > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      {questions.filter(q => q.isFlagged).length}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  Genel Bakış
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* İçerik Yönetimi Tab */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Kurs İçerikleri</h3>
                  <button 
                    onClick={handleAddContent}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <PlusIcon className="h-4 w-4" />
                    İçerik Ekle
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courseContents.map((content) => (
                    <div key={content.id} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {content.type === 'video' && <VideoCameraIcon className="h-5 w-5 text-blue-600" />}
                          {content.type === 'document' && <DocumentTextIcon className="h-5 w-5 text-green-600" />}
                          {content.type === 'quiz' && <QuestionMarkCircleIcon className="h-5 w-5 text-purple-600" />}
                          {content.type === 'assignment' && <ClipboardDocumentListIcon className="h-5 w-5 text-orange-600" />}
                          <span className="text-sm font-medium text-gray-900">{content.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleTogglePublish(content.id)}
                            className={`p-1 rounded ${
                              content.isPublished 
                                ? 'text-green-600 hover:text-green-800' 
                                : 'text-orange-600 hover:text-orange-800'
                            }`}
                            title={content.isPublished ? 'Yayından kaldır' : 'Yayınla'}
                          >
                            {content.isPublished ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
                          </button>
                          <button 
                            onClick={() => handleEditContent(content)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Düzenle"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteContent(content.id)}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Sil"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{content.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Sıra: {content.order}</span>
                        <span className={`px-2 py-1 rounded-full ${
                          content.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {content.isPublished ? 'Yayında' : 'Taslak'}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        Son güncelleme: {formatDate(content.updatedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Öğrenci Notları Tab */}
            {activeTab === 'notes' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Öğrenci Video Notları</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Toplam: {videoNotes.length} not</span>
                    <span className="text-sm text-red-600">Flagged: {videoNotes.filter(n => n.isFlagged).length}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {videoNotes.map((note) => (
                    <div key={note.id} className={`bg-white border rounded-lg p-4 ${
                      note.isFlagged ? 'border-red-200 bg-red-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                              {formatTimestamp(note.timestamp)}
                            </span>
                            <span className="text-sm text-gray-600">by {note.userName}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              note.isPublic 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {note.isPublic ? 'Herkese Açık' : 'Özel'}
                            </span>
                            {note.isFlagged && (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs flex items-center gap-1">
                                <FlagIcon className="h-3 w-3" />
                                Flagged
                              </span>
                            )}
                          </div>
                          <p className="text-gray-900">{note.note}</p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                            <span>{formatDate(note.createdAt)}</span>
                            <span>Video ID: {note.videoId}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {note.isFlagged && (
                            <>
                              <button 
                                onClick={() => handleModerateNote(note.id, 'approve')}
                                className="p-2 text-green-600 hover:text-green-800 bg-green-50 rounded"
                                title="Onayla"
                              >
                                <CheckCircleIcon className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleModerateNote(note.id, 'reject')}
                                className="p-2 text-red-600 hover:text-red-800 bg-red-50 rounded"
                                title="Reddet"
                              >
                                <XCircleIcon className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:text-red-800">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Soru-Cevap Tab */}
            {activeTab === 'qa' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Soru-Cevap Forumu</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {questions.length} soru, {questions.reduce((acc, q) => acc + q.answers.length, 0)} cevap
                    </span>
                    <span className="text-sm text-red-600">Flagged: {questions.filter(q => q.isFlagged).length}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {questions.map((question) => (
                    <div key={question.id} className={`bg-white border rounded-lg p-6 ${
                      question.isFlagged ? 'border-red-200 bg-red-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{question.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              question.isResolved 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {question.isResolved ? 'Çözüldü' : 'Açık'}
                            </span>
                            {question.isFlagged && (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs flex items-center gap-1">
                                <FlagIcon className="h-3 w-3" />
                                Flagged
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 mb-3">{question.content}</p>
                          
                          {/* Question Images */}
                          {question.images.length > 0 && (
                            <div className="flex items-center gap-2 mb-3">
                              <PhotoIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{question.images.length} görsel</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>by {question.userName}</span>
                            <span>{formatDate(question.createdAt)}</span>
                            <span>Ders: {lessons.find(l => l.id === question.lessonId)?.title}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {question.isFlagged && (
                            <>
                              <button 
                                onClick={() => handleModerateQuestion(question.id, 'approve')}
                                className="p-2 text-green-600 hover:text-green-800 bg-green-50 rounded"
                                title="Onayla"
                              >
                                <CheckCircleIcon className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleModerateQuestion(question.id, 'reject')}
                                className="p-2 text-red-600 hover:text-red-800 bg-red-50 rounded"
                                title="Reddet"
                              >
                                <XCircleIcon className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => handleAnswerQuestion(question.id)}
                            className="p-2 text-blue-600 hover:text-blue-800 bg-blue-50 rounded"
                            title="Cevapla"
                          >
                            <ChatBubbleLeftRightIcon className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:text-red-800">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Answers */}
                      {question.answers.length > 0 && (
                        <div className="border-t border-gray-200 pt-4">
                          <h5 className="font-medium text-gray-900 mb-3">Cevaplar ({question.answers.length})</h5>
                          <div className="space-y-3">
                            {question.answers.map((answer) => (
                              <div key={answer.id} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="text-gray-700 mb-2">{answer.content}</p>
                                    
                                    {/* Answer Images */}
                                    {answer.images.length > 0 && (
                                      <div className="flex items-center gap-2 mb-2">
                                        <PhotoIcon className="h-3 w-3 text-gray-400" />
                                        <span className="text-xs text-gray-600">{answer.images.length} görsel</span>
                                      </div>
                                    )}
                                    
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                      <span>by {answer.userName}</span>
                                      <span>{formatDate(answer.createdAt)}</span>
                                      {answer.isAccepted && (
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                          Kabul Edildi
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button className="p-1 text-gray-400 hover:text-gray-600">
                                      <EyeIcon className="h-3 w-3" />
                                    </button>
                                    <button className="p-1 text-red-600 hover:text-red-800">
                                      <TrashIcon className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Genel Bakış Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Sistem Genel Bakışı</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* İstatistik Kartları */}
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpenIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">Toplam İçerik</p>
                        <p className="text-2xl font-bold text-blue-900">{courseContents.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DocumentTextIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">Toplam Not</p>
                        <p className="text-2xl font-bold text-green-900">{videoNotes.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <QuestionMarkCircleIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-purple-600">Açık Sorular</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {questions.filter(q => !q.isResolved).length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <FlagIcon className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-orange-600">Flagged İçerik</p>
                        <p className="text-2xl font-bold text-orange-900">
                          {videoNotes.filter(n => n.isFlagged).length + questions.filter(q => q.isFlagged).length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h4>
                  <div className="space-y-3">
                    {videoNotes.slice(0, 3).map((note) => (
                      <div key={note.id} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600">
                          <strong>{note.userName}</strong> {note.timestamp}. saniyede not ekledi
                        </span>
                        <span className="text-gray-400">{formatDate(note.createdAt)}</span>
                      </div>
                    ))}
                    {questions.slice(0, 2).map((question) => (
                      <div key={question.id} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">
                          <strong>{question.userName}</strong> yeni soru sordu
                        </span>
                        <span className="text-gray-400">{formatDate(question.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals will be added here */}
      {showAddContentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Yeni İçerik Ekle</h2>
              <p className="text-gray-600 mb-6">Bu modal'da içerik ekleme formu olacak</p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowAddContentModal(false)}
                  className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditContentModal && selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">İçerik Düzenle</h2>
              <p className="text-gray-600 mb-6">Bu modal'da içerik düzenleme formu olacak: {selectedContent.title}</p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowEditContentModal(false)}
                  className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}
