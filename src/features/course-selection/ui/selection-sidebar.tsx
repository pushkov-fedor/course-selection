// src/features/course-selection/ui/selection-sidebar.tsx
"use client";

import { Button, Badge } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { DisplayCourse } from "@/entities/course";
import { formatTerm, pluralizeCourses } from "@/entities/course";
import { X, ClipboardList } from "lucide-react";

interface SelectionSidebarProps {
  selectedCourses: DisplayCourse[];
  onRemove: (offeringId: string) => void;
  onOpenCourse: (course: DisplayCourse) => void;
  onConfirm: () => void;
}

export function SelectionSidebar({
  selectedCourses,
  onRemove,
  onOpenCourse,
  onConfirm,
}: SelectionSidebarProps) {
  return (
    <aside className="w-80 shrink-0">
      <div className="sticky top-24 bg-card rounded-xl border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <ClipboardList className="size-5 text-primary" />
            <h2 className="font-semibold">Выбранные курсы</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedCourses.length} {pluralizeCourses(selectedCourses.length)}
          </p>
        </div>

        {/* Course list */}
        <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
          {selectedCourses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ClipboardList className="size-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Вы пока не выбрали ни одного курса</p>
            </div>
          ) : (
            selectedCourses.map((course, index) => (
              <div
                key={course.offeringId}
                className={cn(
                  "p-3 rounded-lg border bg-muted/30 opacity-0 animate-fade-in-up group"
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => onOpenCourse(course)}
                    className="text-left flex-1 min-w-0 hover:text-primary transition-colors"
                  >
                    {course.code && (
                      <Badge variant="outline" className="mb-1 text-xs">
                        {course.code}
                      </Badge>
                    )}
                    <p className="font-medium text-sm truncate">{course.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatTerm(course.term)} {course.year}
                    </p>
                  </button>
                  <button
                    onClick={() => onRemove(course.offeringId)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                    aria-label="Удалить"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/30">
          <Button
            className="w-full"
            disabled={selectedCourses.length === 0}
            onClick={onConfirm}
          >
            Подтвердить выбор
          </Button>
        </div>
      </div>
    </aside>
  );
}

