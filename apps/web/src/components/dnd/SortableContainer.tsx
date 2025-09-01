'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CourseSection, CourseLesson } from '@/types/course';

interface SortableContainerProps {
  sections: CourseSection[];
  onSectionsReorder: (sections: CourseSection[]) => void;
  onLessonsReorder: (sectionId: string, lessons: CourseLesson[]) => void;
  children: React.ReactNode;
}

export function SortableContainer({
  sections,
  onSectionsReorder,
  onLessonsReorder,
  children
}: SortableContainerProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Check if we're reordering sections or lessons
    const activeSection = sections.find(s => s.id === active.id);
    const overSection = sections.find(s => s.id === over.id);

    if (activeSection && overSection) {
      // Reordering sections
      const oldIndex = sections.findIndex(s => s.id === active.id);
      const newIndex = sections.findIndex(s => s.id === over.id);
      
      const newSections = arrayMove(sections, oldIndex, newIndex);
      onSectionsReorder(newSections);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sections.map(s => s.id)}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
}
