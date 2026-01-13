// src/components/CourseTiles.tsx
"use client";

import { Course, CourseBlock, BLOCK_COLORS, DAY_NAMES_FULL, Selection } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CourseTilesProps {
  courses: Course[];
  blocks: CourseBlock[];
  selections: Selection[];
  onSelectCourse: (blockId: string, courseId: string | null) => void;
  onOpenCourse: (course: Course) => void;
}

export function CourseTiles({ 
  courses, 
  blocks, 
  selections, 
  onSelectCourse,
  onOpenCourse,
}: CourseTilesProps) {
  const getSelectedCourseId = (blockId: string): string | null => {
    return selections.find(s => s.blockId === blockId)?.courseId ?? null;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    });
  };

  const formatTimeRange = (course: Course) => {
    const slots = course.schedule.slots;
    if (slots.length === 0) return "";
    
    const days = slots.map(s => DAY_NAMES_FULL[s.dayOfWeek]).join(", ");
    const time = `${slots[0].startTime}–${slots[0].endTime}`;
    return `${days}, ${time}`;
  };

  return (
    <div className="space-y-8">
      {blocks.map((block) => {
        const blockCourses = courses.filter(c => c.blockId === block.id);
        const selectedCourseId = getSelectedCourseId(block.id);
        const colors = BLOCK_COLORS[block.color];

        return (
          <div key={block.id}>
            {/* Block header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("w-4 h-4 rounded-full", colors.bg)} />
              <h2 className={cn("text-xl font-semibold", colors.text)}>
                {block.name}
              </h2>
              {block.required && (
                <Badge variant="outline" className={cn("text-xs", colors.border, colors.text)}>
                  Обязательный
                </Badge>
              )}
            </div>
            
            {block.description && (
              <p className="text-sm text-muted-foreground mb-4 -mt-2">
                {block.description}
              </p>
            )}

            {/* Courses grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {blockCourses.map((course) => {
                const isSelected = selectedCourseId === course.id;
                const isDisabled = selectedCourseId !== null && selectedCourseId !== course.id;
                const isFull = course.status === "full";
                const spots = course.maxStudents - course.enrolledStudents;

                return (
                  <Card 
                    key={course.id}
                    className={cn(
                      "relative cursor-pointer transition-all duration-200",
                      isSelected && `ring-2 ${colors.border} ${colors.light}`,
                      isDisabled && "opacity-50",
                      !isSelected && !isDisabled && "hover:shadow-md hover:border-primary/30",
                    )}
                    onClick={() => onOpenCourse(course)}
                  >
                    {/* Selection checkbox */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isFull || isSelected) {
                          onSelectCourse(block.id, isSelected ? null : course.id);
                        }
                      }}
                      disabled={isDisabled || (isFull && !isSelected)}
                      className={cn(
                        "absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors z-10",
                        isSelected 
                          ? `${colors.bg} border-transparent` 
                          : "border-border hover:border-primary/50",
                        (isDisabled || (isFull && !isSelected)) && "cursor-not-allowed"
                      )}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    <CardHeader className="pb-2">
                      <CardTitle className="text-base pr-6 leading-tight">
                        {course.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {course.instructor}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>

                      {/* Meta info */}
                      <div className="flex flex-wrap gap-2 text-xs">
                        <Badge variant="secondary">
                          {course.credits} кредит{course.credits === 1 ? "" : course.credits < 5 ? "а" : "ов"}
                        </Badge>
                        <Badge 
                          variant="secondary" 
                          className={cn(isFull && "bg-amber-100 text-amber-700")}
                        >
                          {isFull ? "Мест нет" : `${spots} мест`}
                        </Badge>
                      </div>

                      {/* Schedule */}
                      <div className="pt-2 border-t border-border space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                          <span>
                            {formatDate(course.schedule.startDate)} — {formatDate(course.schedule.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{formatTimeRange(course)}</span>
                        </div>
                      </div>

                      {/* Enrollment bar */}
                      <div className="pt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Записалось</span>
                          <span className={cn(
                            "font-medium",
                            isFull ? "text-amber-600" : ""
                          )}>
                            {course.enrolledStudents}/{course.maxStudents}
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all",
                              isFull ? "bg-amber-500" : colors.bg
                            )}
                            style={{ width: `${(course.enrolledStudents / course.maxStudents) * 100}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
