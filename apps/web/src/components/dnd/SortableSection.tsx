'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { CourseSection, CourseLesson } from '@/types/course';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core';

interface SortableSectionProps {
  section: CourseSection;
  sectionIndex: number;
  onEdit: (section: CourseSection) => void;
  onAddLesson: (lesson?: CourseLesson, sectionId?: string) => void;
  onLessonsReorder: (sectionId: string, lessons: CourseLesson[]) => void;
  children: React.ReactNode;
}

export function SortableSection({ 
  section, 
  sectionIndex, 
  onEdit, 
  onAddLesson,
  onLessonsReorder,
  children 
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleLessonsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Only handle lesson reordering within this section
    const activeLesson = section.lessons.find(l => l.id === active.id);
    const overLesson = section.lessons.find(l => l.id === over.id);

    if (activeLesson && overLesson) {
      const oldIndex = section.lessons.findIndex(l => l.id === active.id);
      const newIndex = section.lessons.findIndex(l => l.id === over.id);
      
      const newLessons = arrayMove(section.lessons, oldIndex, newIndex);
      onLessonsReorder(section.id, newLessons);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-gray-200 rounded-lg ${isDragging ? 'shadow-2xl' : ''}`}
    >
      {/* Section Header with Drag Handle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <Bars3Icon className="h-4 w-4 text-gray-500" />
          </div>
          
          <span className="text-sm font-medium text-gray-500">Bölüm {sectionIndex + 1}</span>
          <h4 className="font-medium text-gray-900">{section.title}</h4>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(section)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Bölümü Düzenle"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onAddLesson(undefined, section.id)}
            className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
            title="Ders Ekle"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Section Content with separate DndContext for lessons */}
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleLessonsDragEnd}
      >
        <SortableContext
          items={section.lessons.map(l => l.id)}
          strategy={verticalListSortingStrategy}
        >
          {children}
        </SortableContext>
      </DndContext>
    </div>
  );
}
