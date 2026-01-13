// src/components/SemesterCalendar.tsx
"use client";

import { useMemo, useState } from "react";
import { Course, CourseBlock, BLOCK_COLORS, DAY_NAMES, DayOfWeek, Selection } from "@/types";
import { cn } from "@/lib/utils";
import { getSemesterWeeks } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

interface SemesterCalendarProps {
  courses: Course[];
  blocks: CourseBlock[];
  selections: Selection[];
  onSelectCourse: (blockId: string, courseId: string | null) => void;
}

export function SemesterCalendar({ 
  courses, 
  blocks, 
  selections, 
  onSelectCourse 
}: SemesterCalendarProps) {
  const weeks = useMemo(() => getSemesterWeeks(), []);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  
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

  // Получить курсы активные на выбранной неделе
  const getCoursesForWeek = (weekIndex: number) => {
    const weekStart = weeks[weekIndex];
    return courses.filter(course => isCourseInWeek(course, weekStart));
  };

  return (
    <div className="space-y-4">
      {/* Gantt Timeline */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="p-3 border-b border-border bg-slate-50 flex items-center justify-between">
          <h3 className="font-semibold text-sm">Расписание на семестр</h3>
          <p className="text-xs text-muted-foreground">
            Кликните на неделю, чтобы посмотреть расписание
          </p>
        </div>

        {/* Weeks header */}
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Months row */}
            <div className="flex border-b border-border bg-slate-50">
              <div className="w-44 shrink-0 px-3 py-1" />
              <div className="flex-1 flex">
                {weeks.map((week, index) => {
                  const showMonth = index === 0 || week.getMonth() !== weeks[index - 1].getMonth();
                  return (
                    <div key={index} className="flex-1 min-w-[50px] px-1">
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

            {/* Weeks row - clickable */}
            <div className="flex border-b border-border">
              <div className="w-44 shrink-0 px-3 py-2 text-xs text-muted-foreground">
                Неделя
              </div>
              <div className="flex-1 flex">
                {weeks.map((week, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedWeekIndex(index)}
                    className={cn(
                      "flex-1 min-w-[50px] py-2 text-center text-[11px] border-r border-border/50 last:border-r-0 transition-all",
                      selectedWeekIndex === index 
                        ? "bg-blue-500 text-white font-medium" 
                        : "hover:bg-blue-50"
                    )}
                  >
                    {formatWeekDate(week)}
                  </button>
                ))}
              </div>
            </div>

            {/* Course rows */}
            {blocks.map(block => {
              const blockCourses = courses.filter(c => c.blockId === block.id);
              const selectedCourseId = getSelectedCourseId(block.id);
              const colors = BLOCK_COLORS[block.color];

              return (
                <div key={block.id}>
                  {/* Block header */}
                  <div className={cn("flex items-center gap-2 px-3 py-1", colors.light)}>
                    <div className={cn("w-2 h-2 rounded-full", colors.bg)} />
                    <span className={cn("text-xs font-medium", colors.text)}>{block.name}</span>
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
                          isDisabled && "opacity-30"
                        )}
                      >
                        {/* Course info */}
                        <div className="w-44 shrink-0 px-3 py-2 border-r border-border">
                          <button
                            onClick={() => onSelectCourse(block.id, isSelected ? null : course.id)}
                            disabled={isFull && !isSelected}
                            className={cn(
                              "w-full text-left flex items-start gap-2",
                              isFull && !isSelected && "cursor-not-allowed"
                            )}
                          >
                            <div className={cn(
                              "mt-0.5 w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center",
                              isSelected ? `${colors.bg} border-transparent` : "border-muted-foreground/30"
                            )}>
                              {isSelected && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={cn("text-sm font-medium truncate", isSelected && colors.text)}>
                                {course.shortTitle || course.title}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                {course.schedule.slots.map(s => DAY_NAMES[s.dayOfWeek]).join(", ")} • {course.credits}кр
                                {isFull && <span className="text-amber-600 ml-1">• мест нет</span>}
                              </div>
                            </div>
                          </button>
                        </div>

                        {/* Gantt bar */}
                        <div className="flex-1 flex items-center">
                          {weeks.map((week, index) => {
                            const inWeek = isCourseInWeek(course, week);
                            const isFirst = isFirstWeek(course, week);
                            const isLast = isLastWeek(course, week);
                            const isWeekSelected = selectedWeekIndex === index;

                            return (
                              <div 
                                key={index}
                                className={cn(
                                  "flex-1 min-w-[50px] h-7 flex items-center px-[2px]",
                                  isWeekSelected && "bg-blue-50"
                                )}
                              >
                                {inWeek && (
                                  <div 
                                    className={cn(
                                      "w-full h-4",
                                      isSelected ? colors.bg : `${colors.bg} opacity-50`,
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
        </div>
      </div>

      {/* Week Schedule Panel */}
      <WeekSchedule
        weekIndex={selectedWeekIndex}
        weekStart={weeks[selectedWeekIndex]}
        courses={getCoursesForWeek(selectedWeekIndex)}
        blocks={blocks}
        selections={selections}
        totalWeeks={weeks.length}
        onWeekChange={setSelectedWeekIndex}
      />
    </div>
  );
}

// Компонент расписания недели
interface WeekScheduleProps {
  weekIndex: number;
  weekStart: Date;
  courses: Course[];
  blocks: CourseBlock[];
  selections: Selection[];
  totalWeeks: number;
  onWeekChange: (index: number) => void;
}

function WeekSchedule({ 
  weekIndex, 
  weekStart, 
  courses, 
  blocks, 
  selections, 
  totalWeeks,
  onWeekChange 
}: WeekScheduleProps) {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const getSelectedCourseId = (blockId: string): string | null => {
    return selections.find(s => s.blockId === blockId)?.courseId ?? null;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
  };

  const DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6];
  const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 - 20:00

  const timeToPercent = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return ((h - 8) * 60 + m) / (13 * 60) * 100;
  };

  const durationToPercent = (start: string, end: string) => {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const duration = (eh * 60 + em) - (sh * 60 + sm);
    return duration / (13 * 60) * 100;
  };

  // Все слоты для отображения (и выбранные, и нет)
  const allSlotsByDay = useMemo(() => {
    const result: Record<DayOfWeek, Array<{ course: Course; slot: Course["schedule"]["slots"][0]; isSelected: boolean }>> = {
      0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
    };

    courses.forEach(course => {
      const isSelected = getSelectedCourseId(course.blockId) === course.id;
      course.schedule.slots.forEach(slot => {
        result[slot.dayOfWeek].push({ course, slot, isSelected });
      });
    });

    return result;
  }, [courses, selections]);

  // Проверка конфликтов
  const hasTimeConflict = (slot1: Course["schedule"]["slots"][0], slot2: Course["schedule"]["slots"][0]) => {
    if (slot1.dayOfWeek !== slot2.dayOfWeek) return false;
    const toMin = (t: string) => { const [h,m] = t.split(":").map(Number); return h*60+m; };
    return toMin(slot1.startTime) < toMin(slot2.endTime) && toMin(slot2.startTime) < toMin(slot1.endTime);
  };

  const conflicts = useMemo(() => {
    const selected = courses.filter(c => getSelectedCourseId(c.blockId) === c.id);
    const result: string[] = [];
    for (let i = 0; i < selected.length; i++) {
      for (let j = i + 1; j < selected.length; j++) {
        for (const s1 of selected[i].schedule.slots) {
          for (const s2 of selected[j].schedule.slots) {
            if (hasTimeConflict(s1, s2)) {
              result.push(`${selected[i].shortTitle} и ${selected[j].shortTitle}`);
            }
          }
        }
      }
    }
    return result;
  }, [courses, selections]);

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      {/* Header with navigation */}
      <div className="p-3 border-b border-border bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWeekChange(Math.max(0, weekIndex - 1))}
            disabled={weekIndex === 0}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          
          <div className="text-center">
            <h3 className="font-semibold text-sm">
              Неделя {weekIndex + 1}
            </h3>
            <p className="text-xs text-muted-foreground">
              {formatDate(weekStart)} — {formatDate(weekEnd)}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onWeekChange(Math.min(totalWeeks - 1, weekIndex + 1))}
            disabled={weekIndex === totalWeeks - 1}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>

        {conflicts.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Конфликт: {conflicts[0]}
          </div>
        )}
      </div>

      {/* Calendar grid */}
      <div className="p-4">
        <div className="grid grid-cols-[50px_repeat(6,1fr)] gap-px bg-border rounded-lg overflow-hidden">
          {/* Header row */}
          <div className="bg-slate-100 p-2" />
          {DAYS.map(day => (
            <div key={day} className="bg-slate-100 p-2 text-center">
              <div className="font-medium text-sm">{DAY_NAMES[day]}</div>
            </div>
          ))}

          {/* Time column + day columns */}
          <div className="bg-white">
            {HOURS.map(hour => (
              <div key={hour} className="h-10 flex items-start justify-end pr-2 text-xs text-muted-foreground border-t border-border/50 first:border-t-0">
                {hour}:00
              </div>
            ))}
          </div>

          {DAYS.map(day => {
            const daySlots = allSlotsByDay[day];

            return (
              <div 
                key={day} 
                className="bg-white relative"
                style={{ height: `${HOURS.length * 40}px` }}
              >
                {/* Hour lines */}
                {HOURS.map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-full border-t border-border/30"
                    style={{ top: `${(i / HOURS.length) * 100}%` }}
                  />
                ))}

                {/* Course slots */}
                {daySlots.map(({ course, slot, isSelected }, idx) => {
                  const block = blocks.find(b => b.id === course.blockId);
                  if (!block) return null;
                  const colors = BLOCK_COLORS[block.color];
                  const selectedInBlock = getSelectedCourseId(block.id);
                  const isDisabled = selectedInBlock !== null && selectedInBlock !== course.id;

                  return (
                    <div
                      key={idx}
                      className={cn(
                        "absolute left-1 right-1 rounded px-1.5 py-1 overflow-hidden text-xs transition-opacity",
                        isSelected 
                          ? `${colors.bg} text-white` 
                          : `${colors.light} ${colors.text} border ${colors.border}`,
                        isDisabled && "opacity-30"
                      )}
                      style={{
                        top: `${timeToPercent(slot.startTime)}%`,
                        height: `${durationToPercent(slot.startTime, slot.endTime)}%`,
                        minHeight: "24px"
                      }}
                    >
                      <div className="font-medium truncate text-[11px]">
                        {course.shortTitle || course.title}
                      </div>
                      <div className={cn(
                        "text-[10px] truncate",
                        isSelected ? "text-white/80" : "text-muted-foreground"
                      )}>
                        {slot.startTime}–{slot.endTime}
                        {slot.room && ` • ${slot.room}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 pb-3">
        <div className="flex flex-wrap gap-3 text-xs">
          {blocks.map(block => {
            const colors = BLOCK_COLORS[block.color];
            const activeCourses = courses.filter(c => c.blockId === block.id);
            if (activeCourses.length === 0) return null;

            return (
              <div key={block.id} className="flex items-center gap-1.5">
                <div className={cn("w-3 h-3 rounded", colors.bg)} />
                <span className="text-muted-foreground">{block.name}</span>
              </div>
            );
          })}
          <div className="flex items-center gap-1.5 ml-auto">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-muted-foreground">Выбрано</span>
            <div className="w-3 h-3 rounded bg-blue-200 border border-blue-300 ml-2" />
            <span className="text-muted-foreground">Доступно</span>
          </div>
        </div>
      </div>
    </div>
  );
}
