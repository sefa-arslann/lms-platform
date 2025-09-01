'use client';

import { useState } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface CourseFormData {
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
}

interface CourseCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (courseData: CourseFormData) => void;
}

const defaultFormData: CourseFormData = {
  title: '',
  slug: '',
  description: '',
  shortDescription: '',
  price: 0,
  currency: 'TRY',
  level: 'BEGINNER',
  language: 'Türkçe',
  category: '',
  tags: [],
  duration: 0,
  totalLessons: 0,
  totalSections: 0,
  isPublished: false,
  isActive: true,
  featured: false,
  thumbnail: '',
  previewVideo: '',
  requirements: [''],
  whatYouWillLearn: ['']
};

export default function CourseCreateModal({ isOpen, onClose, onSubmit }: CourseCreateModalProps) {
  const [formData, setFormData] = useState<CourseFormData>(defaultFormData);
  const [newTag, setNewTag] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newLearning, setNewLearning] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (field: keyof CourseFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({ ...prev, requirements: [...prev.requirements, newRequirement.trim()] }));
      setNewRequirement('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      requirements: prev.requirements.filter((_, i) => i !== index) 
    }));
  };

  const handleAddLearning = () => {
    if (newLearning.trim()) {
      setFormData(prev => ({ ...prev, whatYouWillLearn: [...prev.whatYouWillLearn, newLearning.trim()] }));
      setNewLearning('');
    }
  };

  const handleRemoveLearning = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      whatYouWillLearn: prev.whatYouWillLearn.filter((_, i) => i !== index) 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(defaultFormData);
    onClose();
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    handleInputChange('slug', slug);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Yeni Kurs Oluştur</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kurs Başlığı *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Kurs başlığını girin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="kurs-url-slug"
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Oluştur
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kısa Açıklama *
              </label>
              <input
                type="text"
                required
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Kısa kurs açıklaması"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori *
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Web Geliştirme"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seviye *
              </label>
              <select
                required
                value={formData.level}
                onChange={(e) => handleInputChange('level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="BEGINNER">Başlangıç</option>
                <option value="INTERMEDIATE">Orta</option>
                <option value="ADVANCED">İleri</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dil *
              </label>
              <select
                required
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Türkçe">Türkçe</option>
                <option value="English">English</option>
                <option value="Deutsch">Deutsch</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiyat *
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="TRY">TRY</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Toplam Süre (Dakika) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="480"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Toplam Bölüm Sayısı *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.totalSections}
                onChange={(e) => handleInputChange('totalSections', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="6"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Toplam Ders Sayısı *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.totalLessons}
                onChange={(e) => handleInputChange('totalLessons', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="24"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detaylı Açıklama *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Kurs hakkında detaylı bilgi..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiketler
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Yeni etiket ekle"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gereksinimler
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Yeni gereksinim ekle"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
              />
              <button
                type="button"
                onClick={handleAddRequirement}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-gray-500">•</span>
                  <span className="flex-1">{req}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* What You Will Learn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Neler Öğreneceksiniz
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newLearning}
                onChange={(e) => setNewLearning(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Yeni öğrenim hedefi ekle"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLearning())}
              />
              <button
                type="button"
                onClick={handleAddLearning}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {formData.whatYouWillLearn.map((learning, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-gray-500">✓</span>
                  <span className="flex-1">{learning}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLearning(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Media URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail URL
              </label>
              <input
                type="url"
                value={formData.thumbnail}
                onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Önizleme Video URL
              </label>
              <input
                type="url"
                value={formData.previewVideo}
                onChange={(e) => handleInputChange('previewVideo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/preview.mp4"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
                Hemen Yayınla
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Aktif
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                Öne Çıkan
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Kurs Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
