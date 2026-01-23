// src/features/course-selection/ui/mobile-selection-bar.tsx
"use client";

import { useState } from "react";
import { Button, Badge } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { DisplayCourse } from "@/entities/course";
import { formatTerm, pluralizeCourses } from "@/entities/course";
import { X, ChevronUp, ClipboardList } from "lucide-react";

interface MobileSelectionBarProps {
  selectedCourses: DisplayCourse[];
  onRemove: (offeringId: string) => void;
  onOpenCourse: (course: DisplayCourse) => void;
  onConfirm: () => void;
}

export function MobileSelectionBar({
  selectedCourses,
  onRemove,
  onOpenCourse,
  onConfirm,
}: MobileSelectionBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const count = selectedCourses.length;

  return (
    <>
      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Bottom bar */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card border-t shadow-lg transition-transform duration-300",
          isExpanded && "translate-y-0"
        )}
      >
        {/* Expanded panel */}
        {isExpanded && (
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2 border-b">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">
                Выбранные курсы ({count})
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            {selectedCourses.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <ClipboardList className="size-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Вы пока не выбрали ни одного курса</p>
              </div>
            ) : (
              selectedCourses.map((course) => (
                <div
                  key={course.offeringId}
                  className="p-3 rounded-lg border bg-muted/30 flex items-start gap-3"
                >
                  <button
                    onClick={() => {
                      setIsExpanded(false);
                      onOpenCourse(course);
                    }}
                    className="flex-1 text-left min-w-0"
                  >
                    {course.code && (
                      <Badge variant="outline" className="mb-1 text-xs">
                        {course.code}
                      </Badge>
                    )}
                    <p className="font-medium text-sm">{course.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTerm(course.term)} {course.year}
                    </p>
                  </button>
                  <button
                    onClick={() => onRemove(course.offeringId)}
                    className="p-1.5 text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Bar */}
        <div className="p-3 flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 flex-1 min-w-0"
          >
            <div className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              {count}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">
                {count} {pluralizeCourses(count)}
              </p>
              <p className="text-xs text-muted-foreground">
                {isExpanded ? "Скрыть" : "Показать выбранные"}
              </p>
            </div>
            <ChevronUp
              className={cn(
                "size-5 text-muted-foreground ml-auto transition-transform",
                isExpanded && "rotate-180"
              )}
            />
          </button>

          <Button
            onClick={onConfirm}
            disabled={count === 0}
            className="shrink-0"
          >
            Подтвердить
          </Button>
        </div>
      </div>
    </>
  );
}

