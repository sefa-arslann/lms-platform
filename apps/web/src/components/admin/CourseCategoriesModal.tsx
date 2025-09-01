'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, PencilIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
  courseCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CourseCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categories: Category[]) => void;
  categories: Category[];
}

const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'Web Geliştirme',
    slug: 'web-gelistirme',
    description: 'HTML, CSS, JavaScript ve modern web teknolojileri',
    color: 'bg-blue-100 text-blue-800',
    icon: '🌐',
    isActive: true,
    courseCount: 12,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Mobil Geliştirme',
    slug: 'mobil-gelistirme',
    description: 'iOS, Android ve cross-platform mobil uygulamalar',
    color: 'bg-green-100 text-green-800',
    icon: '📱',
    isActive: true,
    courseCount: 8,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Veri Bilimi',
    slug: 'veri-bilimi',
    description: 'Python, makine öğrenmesi ve veri analizi',
    color: 'bg-purple-100 text-purple-800',
    icon: '📊',
    isActive: true,
    courseCount: 6,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Tasarım',
    slug: 'tasarim',
    description: 'UI/UX, grafik tasarım ve dijital sanat',
    color: 'bg-pink-100 text-pink-800',
    icon: '🎨',
    isActive: true,
    courseCount: 10,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const colorOptions = [
  { value: 'bg-blue-100 text-blue-800', label: 'Mavi' },
  { value: 'bg-green-100 text-green-800', label: 'Yeşil' },
  { value: 'bg-purple-100 text-purple-800', label: 'Mor' },
  { value: 'bg-pink-100 text-pink-800', label: 'Pembe' },
  { value: 'bg-yellow-100 text-yellow-800', label: 'Sarı' },
  { value: 'bg-red-100 text-red-800', label: 'Kırmızı' },
  { value: 'bg-indigo-100 text-indigo-800', label: 'İndigo' },
  { value: 'bg-gray-100 text-gray-800', label: 'Gri' }
];

const iconOptions = ['🌐', '📱', '📊', '🎨', '💻', '🔧', '📚', '🎯', '🚀', '⚡', '🎮', '📱', '💡', '🔍', '📈', '🎪'];

export default function CourseCategoriesModal({ isOpen, onClose, onSave, categories }: CourseCategoriesModalProps) {
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    color: 'bg-blue-100 text-blue-800',
    icon: '🌐',
    isActive: true
  });

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  if (!isOpen) return null;

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.slug) {
      const category: Category = {
        id: Date.now().toString(),
        name: newCategory.name,
        slug: newCategory.slug,
        description: newCategory.description || '',
        color: newCategory.color || 'bg-blue-100 text-blue-800',
        icon: newCategory.icon || '🌐',
        isActive: newCategory.isActive !== false,
        courseCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setLocalCategories(prev => [...prev, category]);
      setNewCategory({
        name: '',
        slug: '',
        description: '',
        color: 'bg-blue-100 text-blue-800',
        icon: '🌐',
        isActive: true
      });
      setShowAddForm(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const handleUpdateCategory = () => {
    if (editingCategory) {
      setLocalCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...editingCategory, updatedAt: new Date().toISOString() }
          : cat
      ));
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      setLocalCategories(prev => prev.filter(cat => cat.id !== categoryId));
    }
  };

  const handleSave = () => {
    onSave(localCategories);
    onClose();
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    if (editingCategory) {
      setEditingCategory(prev => ({ ...prev!, name, slug: generateSlug(name) }));
    } else {
      setNewCategory(prev => ({ ...prev, name, slug: generateSlug(name) }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Kurs Kategorileri</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Add New Category */}
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600">
                <PlusIcon className="h-5 w-5" />
                <span className="font-medium">Yeni Kategori Ekle</span>
              </div>
            </button>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Yeni Kategori</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori Adı *
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Kategori adı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    value={newCategory.slug}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="kategori-slug"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <input
                    type="text"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Kategori açıklaması"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Renk
                  </label>
                  <select
                    value={newCategory.color}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {colorOptions.map((color) => (
                      <option key={color.value} value={color.value}>
                        {color.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İkon
                  </label>
                  <select
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newCategoryActive"
                    checked={newCategory.isActive}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="newCategoryActive" className="ml-2 block text-sm text-gray-900">
                    Aktif
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Ekle
                </button>
              </div>
            </div>
          )}

          {/* Categories List */}
          <div className="space-y-4">
            {localCategories.map((category) => (
              <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-4">
                {editingCategory?.id === category.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kategori Adı *
                        </label>
                        <input
                          type="text"
                          value={editingCategory.name}
                          onChange={(e) => handleNameChange(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL Slug *
                        </label>
                        <input
                          type="text"
                          value={editingCategory.slug}
                          onChange={(e) => setEditingCategory(prev => ({ ...prev!, slug: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Açıklama
                        </label>
                        <input
                          type="text"
                          value={editingCategory.description}
                          onChange={(e) => setEditingCategory(prev => ({ ...prev!, description: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Renk
                        </label>
                        <select
                          value={editingCategory.color}
                          onChange={(e) => setEditingCategory(prev => ({ ...prev!, color: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {colorOptions.map((color) => (
                            <option key={color.value} value={color.value}>
                              {color.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          İkon
                        </label>
                        <select
                          value={editingCategory.icon}
                          onChange={(e) => setEditingCategory(prev => ({ ...prev!, icon: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {iconOptions.map((icon) => (
                            <option key={icon} value={icon}>
                              {icon}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`editCategoryActive-${category.id}`}
                          checked={editingCategory.isActive}
                          onChange={(e) => setEditingCategory(prev => ({ ...prev!, isActive: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`editCategoryActive-${category.id}`} className="ml-2 block text-sm text-gray-900">
                          Aktif
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        İptal
                      </button>
                      <button
                        onClick={handleUpdateCategory}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Güncelle
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>Slug: {category.slug}</span>
                          <span>Kurs: {category.courseCount}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                            {category.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Düzenle"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
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
