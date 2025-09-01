'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { CourseLesson } from '@/types/course';
import { formatDurationMMSS } from '@/utils/duration';

interface SortableLessonProps {
  lesson: CourseLesson;
  lessonIndex: number;
  onEdit: (lesson: CourseLesson) => void;
  onDelete: (lessonId: string) => void;
}

export function SortableLesson({ 
  lesson, 
  lessonIndex, 
  onEdit,
  onDelete
}: SortableLessonProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg ${
        isDragging ? 'shadow-lg scale-105' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded transition-colors"
        >
                      <Bars3Icon className="h-3 w-3 text-gray-400" />
        </div>
        
        <span className="text-sm font-medium text-gray-500">{lessonIndex + 1}</span>
        <div>
          <h5 className="font-medium text-gray-900">{lesson.title}</h5>
          {lesson.description && (
            <p className="text-sm text-gray-600">{lesson.description}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-500">
          {formatDurationMMSS(lesson.duration || 0)}
        </span>
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
          lesson.isPublished
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {lesson.isPublished ? 'Yayında' : 'Taslak'}
        </span>
        <button
          onClick={() => onEdit(lesson)}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="Dersi Düzenle"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(lesson.id)}
          className="p-1 text-red-400 hover:text-red-600 transition-colors"
          title="Dersi Sil"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
