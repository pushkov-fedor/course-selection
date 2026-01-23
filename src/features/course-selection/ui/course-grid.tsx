// src/features/course-selection/ui/course-grid.tsx
"use client";

import type { DisplayCourse } from "@/entities/course";
import { CourseCard } from "./course-card";

interface CourseGridProps {
  courses: DisplayCourse[];
  selectedOfferingIds: string[];
  onToggleSelection: (offeringId: string) => void;
  onOpenCourse: (course: DisplayCourse) => void;
  disabled?: boolean;
}

export function CourseGrid({
  courses,
  selectedOfferingIds,
  onToggleSelection,
  onOpenCourse,
  disabled = false,
}: CourseGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {courses.map((course, index) => (
        <CourseCard
          key={course.offeringId}
          course={course}
          isSelected={selectedOfferingIds.includes(course.offeringId)}
          onToggle={() => onToggleSelection(course.offeringId)}
          onOpenDetails={() => onOpenCourse(course)}
          disabled={disabled}
          animationDelay={index * 50}
        />
      ))}
    </div>
  );
}

