// src/components/SemesterCalendar.tsx
"use client";

import { useMemo, useState } from "react";
import { Course, CourseBlock, BLOCK_COLORS, DAY_NAMES, DayOfWeek, Selection } from "@/types";
import { cn } from "@/lib/utils";
import { getSemesterWeeks } from "@/lib/mock-data";

interface SemesterCalendarProps {
  courses: Course[];
  blocks: CourseBlock[];
  selections: Selection[];
  onSelectCourse: (blockId: string, courseId: string | null) => void;
}

// Временные слоты для мини-превью
const TIME_RANGE = { start: 8, end: 20 }; // 8:00 - 20:00

export function SemesterCalendar({ 
  courses, 
  blocks, 
  selections, 
  onSelectCourse 
}: SemesterCalendarProps) {
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const [selectedWeekForPreview, setSelectedWeekForPreview] = useState<number | null>(null);
  
  const weeks = useMemo(() => getSemesterWeeks(), []);
  
  const getSelectedCourseId = (blockId: string): string | null => {
    return selections.find(s => s.blockId === blockId)?.courseId ?? null;
  };

  const formatWeekDate = (date: Date) => {
    return `${date.getDate()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("ru-RU", { month: "short" });
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

  // Получить курсы активные на определённой неделе
  const getCoursesForWeek = (weekIndex: number) => {
    const weekStart = weeks[weekIndex];
    return courses.filter(course => isCourseInWeek(course, weekStart));
  };

  // Проверка конфликта времени между двумя слотами
  const hasTimeConflict = (slot1: Course["schedule"]["slots"][0], slot2: Course["schedule"]["slots"][0]) => {
    if (slot1.dayOfWeek !== slot2.dayOfWeek) return false;
    
    const toMinutes = (time: string) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };
    
    const start1 = toMinutes(slot1.startTime);
    const end1 = toMinutes(slot1.endTime);
    const start2 = toMinutes(slot2.startTime);
    const end2 = toMinutes(slot2.endTime);
    
    return start1 < end2 && start2 < end1;
  };

  // Проверка конфликта между выбранными курсами
  const getConflicts = useMemo(() => {
    const selectedCoursesList = selections
      .filter(s => s.courseId)
      .map(s => courses.find(c => c.id === s.courseId))
      .filter(Boolean) as Course[];

    const conflicts: Array<{ course1: Course; course2: Course; weekIndex: number }> = [];

    for (let wi = 0; wi < weeks.length; wi++) {
      const weekStart = weeks[wi];
      const activeCourses = selectedCoursesList.filter(c => isCourseInWeek(c, weekStart));

      for (let i = 0; i < activeCourses.length; i++) {
        for (let j = i + 1; j < activeCourses.length; j++) {
          const c1 = activeCourses[i];
          const c2 = activeCourses[j];

          for (const slot1 of c1.schedule.slots) {
            for (const slot2 of c2.schedule.slots) {
              if (hasTimeConflict(slot1, slot2)) {
                conflicts.push({ course1: c1, course2: c2, weekIndex: wi });
              }
            }
          }
        }
      }
    }

    return conflicts;
  }, [courses, selections, weeks]);

  const hasConflictInWeek = (weekIndex: number) => {
    return getConflicts.some(c => c.weekIndex === weekIndex);
  };

  const previewWeekIndex = selectedWeekForPreview ?? hoveredWeek;

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      {/* Semester timeline header */}
      <div className="p-4 border-b border-border bg-slate-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Календарь семестра</h3>
          {getConflicts.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {getConflicts.length} конфликт{getConflicts.length > 1 ? "а" : ""} расписания
            </div>
          )}
        </div>
        
        {/* Months row */}
        <div className="flex mb-1">
          <div className="w-40 shrink-0" />
          <div className="flex-1 flex">
            {weeks.map((week, index) => {
              const showMonth = index === 0 || week.getMonth() !== weeks[index - 1].getMonth();
              return (
                <div key={index} className="flex-1 min-w-[40px]">
                  {showMonth && (
                    <span className="text-xs font-medium text-muted-foreground">
                      {formatMonthYear(week)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Weeks row */}
        <div className="flex">
          <div className="w-40 shrink-0 text-xs text-muted-foreground pr-2 text-right">
            Неделя
          </div>
          <div className="flex-1 flex">
            {weeks.map((week, index) => (
              <button
                key={index}
                onClick={() => setSelectedWeekForPreview(selectedWeekForPreview === index ? null : index)}
                onMouseEnter={() => setHoveredWeek(index)}
                onMouseLeave={() => setHoveredWeek(null)}
                className={cn(
                  "flex-1 min-w-[40px] text-center text-[10px] py-1 border-r border-border/30 last:border-r-0 transition-colors",
                  hasConflictInWeek(index) && "bg-red-100",
                  previewWeekIndex === index && "bg-blue-100",
                  selectedWeekForPreview === index && "ring-2 ring-blue-500 ring-inset"
                )}
              >
                {formatWeekDate(week)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course rows */}
      <div className="divide-y divide-border">
        {blocks.map(block => {
          const blockCourses = courses.filter(c => c.blockId === block.id);
          const selectedCourseId = getSelectedCourseId(block.id);
          const colors = BLOCK_COLORS[block.color];

          return (
            <div key={block.id}>
              {/* Block header */}
              <div className={cn("flex items-center gap-2 px-3 py-1.5", colors.light)}>
                <div className={cn("w-2.5 h-2.5 rounded-full", colors.bg)} />
                <span className={cn("text-xs font-medium", colors.text)}>
                  {block.name}
                </span>
              </div>

              {/* Courses */}
              {blockCourses.map(course => {
                const isSelected = selectedCourseId === course.id;
                const isDisabled = selectedCourseId !== null && selectedCourseId !== course.id;
                const isFull = course.status === "full";

                return (
                  <div 
                    key={course.id}
                    className={cn(
                      "flex border-t border-border/30",
                      isDisabled && "opacity-40"
                    )}
                  >
                    {/* Course info */}
                    <div className="w-40 shrink-0 p-2 border-r border-border">
                      <button
                        onClick={() => onSelectCourse(block.id, isSelected ? null : course.id)}
                        disabled={isFull && !isSelected}
                        className={cn(
                          "w-full text-left flex items-start gap-2",
                          isFull && !isSelected && "cursor-not-allowed"
                        )}
                      >
                        <div className={cn(
                          "mt-0.5 w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors",
                          isSelected 
                            ? `${colors.bg} border-transparent` 
                            : "border-muted-foreground/30"
                        )}>
                          {isSelected && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={cn(
                            "text-sm font-medium truncate",
                            isSelected && colors.text
                          )}>
                            {course.shortTitle || course.title}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {course.schedule.slots.map(s => DAY_NAMES[s.dayOfWeek]).join(", ")} • {course.credits}кр
                          </div>
                          {isFull && (
                            <div className="text-[10px] text-amber-600">мест нет</div>
                          )}
                        </div>
                      </button>
                    </div>

                    {/* Gantt bar */}
                    <div className="flex-1 flex items-center">
                      {weeks.map((week, index) => {
                        const inWeek = isCourseInWeek(course, week);
                        const isFirst = isFirstWeek(course, week);
                        const isLast = isLastWeek(course, week);

                        return (
                          <div 
                            key={index}
                            className="flex-1 min-w-[40px] h-8 flex items-center px-[1px]"
                          >
                            {inWeek && (
                              <div 
                                className={cn(
                                  "w-full h-5 transition-all",
                                  isSelected ? colors.bg : `${colors.bg} opacity-60`,
                                  isFirst && "rounded-l",
                                  isLast && "rounded-r",
                                  isDisabled && "opacity-20"
                                )}
                              />
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

      {/* Week preview panel */}
      {previewWeekIndex !== null && (
        <WeekPreview
          weekIndex={previewWeekIndex}
          weekStart={weeks[previewWeekIndex]}
          courses={getCoursesForWeek(previewWeekIndex)}
          blocks={blocks}
          selections={selections}
          onClose={() => setSelectedWeekForPreview(null)}
          isPinned={selectedWeekForPreview !== null}
        />
      )}
    </div>
  );
}

// Компонент превью недели
interface WeekPreviewProps {
  weekIndex: number;
  weekStart: Date;
  courses: Course[];
  blocks: CourseBlock[];
  selections: Selection[];
  onClose: () => void;
  isPinned: boolean;
}

function WeekPreview({ weekIndex, weekStart, courses, blocks, selections, onClose, isPinned }: WeekPreviewProps) {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const getSelectedCourseId = (blockId: string): string | null => {
    return selections.find(s => s.blockId === blockId)?.courseId ?? null;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
  };

  // Временная сетка для мини-календаря
  const DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6];
  const HOURS = Array.from({ length: 12 }, (_, i) => i + 8);

  const timeToPosition = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return ((h - 8) + m / 60) / 12 * 100;
  };

  const durationToHeight = (start: string, end: string) => {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const duration = (eh * 60 + em) - (sh * 60 + sm);
    return (duration / 60) / 12 * 100;
  };

  // Группируем слоты по дням
  const slotsByDay = useMemo(() => {
    const result: Record<DayOfWeek, Array<{ course: Course; slot: Course["schedule"]["slots"][0] }>> = {
      0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
    };

    courses.forEach(course => {
      const isSelected = getSelectedCourseId(course.blockId) === course.id;
      if (!isSelected) return;

      course.schedule.slots.forEach(slot => {
        result[slot.dayOfWeek].push({ course, slot });
      });
    });

    return result;
  }, [courses, selections]);

  return (
    <div className="border-t border-border p-4 bg-slate-50">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-medium text-sm">
            Неделя {weekIndex + 1}: {formatDate(weekStart)} — {formatDate(weekEnd)}
          </h4>
          <p className="text-xs text-muted-foreground">
            Расписание выбранных курсов
          </p>
        </div>
        {isPinned && (
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Mini week calendar */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-[40px_repeat(6,1fr)]">
          {/* Header */}
          <div className="bg-slate-100 p-1" />
          {DAYS.map(day => (
            <div key={day} className="bg-slate-100 p-1 text-center text-xs font-medium border-l border-border">
              {DAY_NAMES[day]}
            </div>
          ))}

          {/* Time grid */}
          <div className="row-span-1">
            {HOURS.map(hour => (
              <div key={hour} className="h-6 text-[10px] text-muted-foreground text-right pr-1 border-t border-border/50">
                {hour}:00
              </div>
            ))}
          </div>

          {/* Day columns */}
          {DAYS.map(day => {
            const daySlots = slotsByDay[day];

            return (
              <div key={day} className="relative border-l border-border" style={{ height: `${HOURS.length * 24}px` }}>
                {/* Hour lines */}
                {HOURS.map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-full border-t border-border/30"
                    style={{ top: `${i * 24}px` }}
                  />
                ))}

                {/* Slots */}
                {daySlots.map(({ course, slot }, idx) => {
                  const block = blocks.find(b => b.id === course.blockId);
                  if (!block) return null;
                  const colors = BLOCK_COLORS[block.color];

                  return (
                    <div
                      key={idx}
                      className={cn(
                        "absolute left-0.5 right-0.5 rounded text-[9px] p-0.5 overflow-hidden",
                        colors.bg, "text-white"
                      )}
                      style={{
                        top: `${timeToPosition(slot.startTime)}%`,
                        height: `${durationToHeight(slot.startTime, slot.endTime)}%`,
                        minHeight: "16px"
                      }}
                    >
                      <div className="font-medium truncate">{course.shortTitle}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active courses list */}
      <div className="mt-3 flex flex-wrap gap-2">
        {courses.map(course => {
          const block = blocks.find(b => b.id === course.blockId);
          if (!block) return null;
          const colors = BLOCK_COLORS[block.color];
          const isSelected = getSelectedCourseId(block.id) === course.id;

          return (
            <div
              key={course.id}
              className={cn(
                "text-xs px-2 py-1 rounded-full flex items-center gap-1",
                isSelected ? colors.bg : colors.light,
                isSelected ? "text-white" : colors.text
              )}
            >
              <span>{course.shortTitle || course.title}</span>
              <span className={cn("opacity-70", !isSelected && "text-muted-foreground")}>
                ({course.schedule.slots.map(s => `${DAY_NAMES[s.dayOfWeek]} ${s.startTime}`).join(", ")})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

