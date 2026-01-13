// src/components/CourseTimeline.tsx
"use client";

import { useMemo } from "react";
import { Course, CourseBlock, BLOCK_COLORS, DAY_NAMES, Selection } from "@/types";
import { cn } from "@/lib/utils";
import { getSemesterWeeks } from "@/lib/mock-data";

interface CourseTimelineProps {
  courses: Course[];
  blocks: CourseBlock[];
  selections: Selection[];
  onSelectCourse: (blockId: string, courseId: string | null) => void;
}

export function CourseTimeline({ 
  courses, 
  blocks, 
  selections, 
  onSelectCourse 
}: CourseTimelineProps) {
  const weeks = useMemo(() => getSemesterWeeks(), []);
  
  const formatWeek = (date: Date) => {
    return `${date.getDate()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
  };

  const getSelectedCourseId = (blockId: string): string | null => {
    return selections.find(s => s.blockId === blockId)?.courseId ?? null;
  };

  const isCourseInWeek = (course: Course, weekStart: Date): boolean => {
    const courseStart = new Date(course.schedule.startDate);
    const courseEnd = new Date(course.schedule.endDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    return courseStart <= weekEnd && courseEnd >= weekStart;
  };

  const isFirstWeek = (course: Course, weekStart: Date): boolean => {
    const courseStart = new Date(course.schedule.startDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    return courseStart >= weekStart && courseStart <= weekEnd;
  };

  const isLastWeek = (course: Course, weekStart: Date): boolean => {
    const courseEnd = new Date(course.schedule.endDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    return courseEnd >= weekStart && courseEnd <= weekEnd;
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1200px]">
        {/* Header with weeks */}
        <div className="flex border-b border-border sticky top-0 bg-background z-10">
          <div className="w-52 shrink-0 p-3 font-medium text-sm text-muted-foreground border-r border-border">
            Курс
          </div>
          <div className="flex-1 flex">
            {weeks.map((week, index) => (
              <div 
                key={index} 
                className="flex-1 min-w-[70px] p-2 text-center text-xs text-muted-foreground border-r border-border last:border-r-0"
              >
                <div className="font-medium">{formatWeek(week)}</div>
                <div className="text-[10px] opacity-60">Нед. {index + 1}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Blocks and courses */}
        {blocks.map((block) => {
          const blockCourses = courses.filter(c => c.blockId === block.id);
          const selectedCourseId = getSelectedCourseId(block.id);
          const colors = BLOCK_COLORS[block.color];

          return (
            <div key={block.id} className="border-b border-border last:border-b-0">
              {/* Block header */}
              <div className={cn("flex items-center gap-2 px-3 py-2", colors.light)}>
                <div className={cn("w-3 h-3 rounded-full", colors.bg)} />
                <span className={cn("font-medium text-sm", colors.text)}>
                  {block.name}
                </span>
                {block.required && (
                  <span className="text-xs text-muted-foreground">(обязательный)</span>
                )}
              </div>

              {/* Courses */}
              {blockCourses.map((course) => {
                const isSelected = selectedCourseId === course.id;
                const isDisabled = selectedCourseId !== null && selectedCourseId !== course.id;
                const isFull = course.status === "full";

                return (
                  <div 
                    key={course.id} 
                    className={cn(
                      "flex border-t border-border/50 transition-colors",
                      isSelected && colors.light,
                      isDisabled && "opacity-40"
                    )}
                  >
                    {/* Course info */}
                    <div className="w-52 shrink-0 p-3 border-r border-border">
                      <button
                        onClick={() => onSelectCourse(block.id, isSelected ? null : course.id)}
                        disabled={isFull && !isSelected}
                        className={cn(
                          "w-full text-left group",
                          isFull && !isSelected && "cursor-not-allowed"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {/* Selection indicator */}
                          <div className={cn(
                            "mt-0.5 w-4 h-4 rounded border-2 shrink-0 transition-colors flex items-center justify-center",
                            isSelected 
                              ? `${colors.bg} border-transparent` 
                              : "border-border group-hover:border-primary/50"
                          )}>
                            {isSelected && (
                              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className={cn(
                              "font-medium text-sm truncate",
                              isSelected && colors.text
                            )}>
                              {course.shortTitle || course.title}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {course.instructor}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{course.credits} кр.</span>
                              <span>•</span>
                              <span className={cn(isFull && "text-amber-600")}>
                                {course.enrolledStudents}/{course.maxStudents}
                              </span>
                              {isFull && <span className="text-amber-600">(полный)</span>}
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Timeline bar */}
                    <div className="flex-1 flex items-center py-2">
                      {weeks.map((week, index) => {
                        const inWeek = isCourseInWeek(course, week);
                        const isFirst = isFirstWeek(course, week);
                        const isLast = isLastWeek(course, week);

                        return (
                          <div 
                            key={index} 
                            className="flex-1 min-w-[70px] px-0.5"
                          >
                            {inWeek && (
                              <div 
                                className={cn(
                                  "h-8 flex items-center justify-center text-xs text-white font-medium transition-opacity",
                                  colors.bg,
                                  isFirst && "rounded-l-md",
                                  isLast && "rounded-r-md",
                                  isDisabled && "opacity-30"
                                )}
                              >
                                {/* Show schedule on first week */}
                                {isFirst && (
                                  <span className="truncate px-2">
                                    {course.schedule.slots.map(s => DAY_NAMES[s.dayOfWeek]).join(", ")}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

