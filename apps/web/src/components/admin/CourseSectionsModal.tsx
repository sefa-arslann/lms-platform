'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // dakika
  videoUrl?: string;
  thumbnail?: string;
  isPublished: boolean;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface Section {
  id: string;
  title: string;
  description: string;
  order: number;
  isPublished: boolean;
  isActive: boolean;
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
}

interface CourseSectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sections: Section[]) => void;
  sections: Section[];
  courseTitle: string;
}

export default function CourseSectionsModal({ isOpen, onClose, onSave, sections, courseTitle }: CourseSectionsModalProps) {
  const [localSections, setLocalSections] = useState<Section[]>(sections);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ sectionId: string; lesson: Lesson } | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState<string | null>(null); // sectionId
  const [newSection, setNewSection] = useState<Partial<Section>>({
    title: '',
    description: '',
    isPublished: true,
    isActive: true
  });
  const [newLesson, setNewLesson] = useState<Partial<Lesson>>({
    title: '',
    description: '',
    duration: 0,
    isPublished: true,
    isActive: true
  });

  useEffect(() => {
    setLocalSections(sections);
  }, [sections]);

  if (!isOpen) return null;

  const handleAddSection = () => {
    if (newSection.title) {
      const section: Section = {
        id: Date.now().toString(),
        title: newSection.title,
        description: newSection.description || '',
        order: localSections.length,
        isPublished: newSection.isPublished !== false,
        isActive: newSection.isActive !== false,
        lessons: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setLocalSections(prev => [...prev, section]);
      setNewSection({
        title: '',
        description: '',
        isPublished: true,
        isActive: true
      });
      setShowAddSection(false);
    }
  };

  const handleAddLesson = (sectionId: string) => {
    if (newLesson.title) {
      const section = localSections.find(s => s.id === sectionId);
      if (section) {
        const lesson: Lesson = {
          id: Date.now().toString(),
          title: newLesson.title,
          description: newLesson.description || '',
          duration: newLesson.duration || 0,
          videoUrl: newLesson.videoUrl,
          thumbnail: newLesson.thumbnail,
          isPublished: newLesson.isPublished !== false,
          isActive: newLesson.isActive !== false,
          order: section.lessons.length,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setLocalSections(prev => prev.map(s => 
          s.id === sectionId 
            ? { ...s, lessons: [...s.lessons, lesson] }
            : s
        ));

        setNewLesson({
          title: '',
          description: '',
          duration: 0,
          isPublished: true,
          isActive: true
        });
        setShowAddLesson(null);
      }
    }
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
  };

  const handleUpdateSection = () => {
    if (editingSection) {
      setLocalSections(prev => prev.map(s => 
        s.id === editingSection.id 
          ? { ...editingSection, updatedAt: new Date().toISOString() }
          : s
      ));
      setEditingSection(null);
    }
  };

  const handleEditLesson = (sectionId: string, lesson: Lesson) => {
    setEditingLesson({ sectionId, lesson });
  };

  const handleUpdateLesson = () => {
    if (editingLesson) {
      setLocalSections(prev => prev.map(s => 
        s.id === editingLesson.sectionId 
          ? { 
              ...s, 
              lessons: s.lessons.map(l => 
                l.id === editingLesson.lesson.id 
                  ? { ...editingLesson.lesson, updatedAt: new Date().toISOString() }
                  : l
              )
            }
          : s
      ));
      setEditingLesson(null);
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    if (confirm('Bu bölümü silmek istediğinizden emin misiniz? Tüm dersler de silinecek.')) {
      setLocalSections(prev => prev.filter(s => s.id !== sectionId));
    }
  };

  const handleDeleteLesson = (sectionId: string, lessonId: string) => {
    if (confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
      setLocalSections(prev => prev.map(s => 
        s.id === sectionId 
          ? { ...s, lessons: s.lessons.filter(l => l.id !== lessonId) }
          : s
      ));
    }
  };

  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    setLocalSections(prev => {
      const sections = [...prev];
      const currentIndex = sections.findIndex(s => s.id === sectionId);
      
      if (direction === 'up' && currentIndex > 0) {
        [sections[currentIndex], sections[currentIndex - 1]] = [sections[currentIndex - 1], sections[currentIndex]];
        sections[currentIndex].order = currentIndex;
        sections[currentIndex - 1].order = currentIndex - 1;
      } else if (direction === 'down' && currentIndex < sections.length - 1) {
        [sections[currentIndex], sections[currentIndex + 1]] = [sections[currentIndex + 1], sections[currentIndex]];
        sections[currentIndex].order = currentIndex;
        sections[currentIndex + 1].order = currentIndex + 1;
      }
      
      return sections;
    });
  };

  const handleMoveLesson = (sectionId: string, lessonId: string, direction: 'up' | 'down') => {
    setLocalSections(prev => {
      const sections = [...prev];
      const section = sections.find(s => s.id === sectionId);
      if (section) {
        const lessons = [...section.lessons];
        const currentIndex = lessons.findIndex(l => l.id === lessonId);
        
        if (direction === 'up' && currentIndex > 0) {
          [lessons[currentIndex], lessons[currentIndex - 1]] = [lessons[currentIndex - 1], lessons[currentIndex]];
          lessons[currentIndex].order = currentIndex;
          lessons[currentIndex - 1].order = currentIndex - 1;
        } else if (direction === 'down' && currentIndex < lessons.length - 1) {
          [lessons[currentIndex], lessons[currentIndex + 1]] = [lessons[currentIndex + 1], lessons[currentIndex]];
          lessons[currentIndex].order = currentIndex;
          lessons[currentIndex + 1].order = currentIndex + 1;
        }
        
        section.lessons = lessons;
      }
      return sections;
    });
  };

  const handleSave = () => {
    onSave(localSections);
    onClose();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}s ${mins}d`;
    }
    return `${mins}d`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kurs Bölümleri</h2>
            <p className="text-gray-600 mt-1">{courseTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Add New Section */}
          {!showAddSection ? (
            <button
              onClick={() => setShowAddSection(true)}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600">
                <PlusIcon className="h-5 w-5" />
                <span className="font-medium">Yeni Bölüm Ekle</span>
              </div>
            </button>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Yeni Bölüm</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bölüm Başlığı *
                  </label>
                  <input
                    type="text"
                    value={newSection.title}
                    onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bölüm başlığı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <input
                    type="text"
                    value={newSection.description}
                    onChange={(e) => setNewSection(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bölüm açıklaması"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newSectionPublished"
                    checked={newSection.isPublished}
                    onChange={(e) => setNewSection(prev => ({ ...prev, isPublished: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="newSectionPublished" className="ml-2 block text-sm text-gray-900">
                    Yayında
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newSectionActive"
                    checked={newSection.isActive}
                    onChange={(e) => setNewSection(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="newSectionActive" className="ml-2 block text-sm text-gray-900">
                    Aktif
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowAddSection(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={handleAddSection}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Ekle
                </button>
              </div>
            </div>
          )}

          {/* Sections List */}
          <div className="space-y-6">
            {localSections.map((section) => (
              <div key={section.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Section Header */}
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  {editingSection?.id === section.id ? (
                    // Edit Section Mode
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bölüm Başlığı *
                        </label>
                        <input
                          type="text"
                          value={editingSection.title}
                          onChange={(e) => setEditingSection(prev => ({ ...prev!, title: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Açıklama
                        </label>
                        <input
                          type="text"
                          value={editingSection.description}
                          onChange={(e) => setEditingSection(prev => ({ ...prev!, description: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`editSectionPublished-${section.id}`}
                          checked={editingSection.isPublished}
                          onChange={(e) => setEditingSection(prev => ({ ...prev!, isPublished: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`editSectionPublished-${section.id}`} className="ml-2 block text-sm text-gray-900">
                          Yayında
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`editSectionActive-${section.id}`}
                          checked={editingSection.isActive}
                          onChange={(e) => setEditingSection(prev => ({ ...prev!, isActive: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`editSectionActive-${section.id}`} className="ml-2 block text-sm text-gray-900">
                          Aktif
                        </label>
                      </div>
                      <div className="flex items-center justify-end space-x-3 col-span-2">
                        <button
                          onClick={() => setEditingSection(null)}
                          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          İptal
                        </button>
                        <button
                          onClick={handleUpdateSection}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Güncelle
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Section Mode
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleMoveSection(section.id, 'up')}
                            disabled={section.order === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            <ChevronUpIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleMoveSection(section.id, 'down')}
                            disabled={section.order === localSections.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            <ChevronDownIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {section.order + 1}. {section.title}
                          </h3>
                          <p className="text-sm text-gray-600">{section.description}</p>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span>{section.lessons.length} ders</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              section.isPublished ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {section.isPublished ? 'Yayında' : 'Taslak'}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              section.isActive ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {section.isActive ? 'Aktif' : 'Pasif'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowAddLesson(section.id)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Ders Ekle
                        </button>
                        <button
                          onClick={() => handleEditSection(section)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Düzenle"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Sil"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lessons List */}
                <div className="p-4 space-y-3">
                  {/* Add New Lesson */}
                  {showAddLesson === section.id && (
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Yeni Ders</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ders Başlığı *
                          </label>
                          <input
                            type="text"
                            value={newLesson.title}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ders başlığı"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Süre (Dakika)
                          </label>
                          <input
                            type="number"
                            value={newLesson.duration}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Açıklama
                          </label>
                          <input
                            type="text"
                            value={newLesson.description}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ders açıklaması"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Video URL
                          </label>
                          <input
                            type="url"
                            value={newLesson.videoUrl}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, videoUrl: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://example.com/video.mp4"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`newLessonPublished-${section.id}`}
                            checked={newLesson.isPublished}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, isPublished: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`newLessonPublished-${section.id}`} className="ml-2 block text-sm text-gray-900">
                            Yayında
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`newLessonActive-${section.id}`}
                            checked={newLesson.isActive}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, isActive: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`newLessonActive-${section.id}`} className="ml-2 block text-sm text-gray-900">
                            Aktif
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center justify-end space-x-3 mt-4">
                        <button
                          onClick={() => setShowAddLesson(null)}
                          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          İptal
                        </button>
                        <button
                          onClick={() => handleAddLesson(section.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Ekle
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Lessons */}
                  {section.lessons.map((lesson) => (
                    <div key={lesson.id} className="bg-gray-50 rounded-lg p-3">
                      {editingLesson?.sectionId === section.id && editingLesson.lesson.id === lesson.id ? (
                        // Edit Lesson Mode
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ders Başlığı *
                              </label>
                              <input
                                type="text"
                                value={editingLesson.lesson.title}
                                onChange={(e) => setEditingLesson(prev => ({ 
                                  ...prev!, 
                                  lesson: { ...prev!.lesson, title: e.target.value }
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Süre (Dakika)
                              </label>
                              <input
                                type="number"
                                value={editingLesson.lesson.duration}
                                onChange={(e) => setEditingLesson(prev => ({ 
                                  ...prev!, 
                                  lesson: { ...prev!.lesson, duration: parseInt(e.target.value) || 0 }
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Açıklama
                              </label>
                              <input
                                type="text"
                                value={editingLesson.lesson.description}
                                onChange={(e) => setEditingLesson(prev => ({ 
                                  ...prev!, 
                                  lesson: { ...prev!.lesson, description: e.target.value }
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Video URL
                              </label>
                              <input
                                type="url"
                                value={editingLesson.lesson.videoUrl}
                                onChange={(e) => setEditingLesson(prev => ({ 
                                  ...prev!, 
                                  lesson: { ...prev!.lesson, videoUrl: e.target.value }
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`editLessonPublished-${lesson.id}`}
                                checked={editingLesson.lesson.isPublished}
                                onChange={(e) => setEditingLesson(prev => ({ 
                                  ...prev!, 
                                  lesson: { ...prev!.lesson, isPublished: e.target.checked }
                                }))}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`editLessonPublished-${lesson.id}`} className="ml-2 block text-sm text-gray-900">
                                Yayında
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`editLessonActive-${lesson.id}`}
                                checked={editingLesson.lesson.isActive}
                                onChange={(e) => setEditingLesson(prev => ({ 
                                  ...prev!, 
                                  lesson: { ...prev!.lesson, isActive: e.target.checked }
                                }))}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`editLessonActive-${lesson.id}`} className="ml-2 block text-sm text-gray-900">
                                Aktif
                              </label>
                            </div>
                          </div>
                          <div className="flex items-center justify-end space-x-3">
                            <button
                              onClick={() => setEditingLesson(null)}
                              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              İptal
                            </button>
                            <button
                              onClick={handleUpdateLesson}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              Güncelle
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View Lesson Mode
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleMoveLesson(section.id, lesson.id, 'up')}
                                disabled={lesson.order === 0}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                              >
                                <ChevronUpIcon className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleMoveLesson(section.id, lesson.id, 'down')}
                                disabled={lesson.order === section.lessons.length - 1}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                              >
                                <ChevronDownIcon className="h-3 w-3" />
                              </button>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {lesson.order + 1}. {lesson.title}
                              </h4>
                              <p className="text-sm text-gray-600">{lesson.description}</p>
                              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                <span>{formatDuration(lesson.duration)}</span>
                                {lesson.videoUrl && (
                                  <span className="text-blue-600">📹 Video</span>
                                )}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  lesson.isPublished ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                                }`}>
                                  {lesson.isPublished ? 'Yayında' : 'Taslak'}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  lesson.isActive ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {lesson.isActive ? 'Aktif' : 'Pasif'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditLesson(section.id, lesson)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Düzenle"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLesson(section.id, lesson.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Sil"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {section.lessons.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>Bu bölümde henüz ders bulunmuyor</p>
                      <button
                        onClick={() => setShowAddLesson(section.id)}
                        className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        İlk dersi ekleyin
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {localSections.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>Bu kursta henüz bölüm bulunmuyor</p>
                <button
                  onClick={() => setShowAddSection(true)}
                  className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  İlk bölümü ekleyin
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
