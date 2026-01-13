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

type View = "semester" | "week";

export function SemesterCalendar({ 
  courses, 
  blocks, 
  selections, 
  onSelectCourse 
}: SemesterCalendarProps) {
  const weeks = useMemo(() => getSemesterWeeks(), []);
  const [view, setView] = useState<View>("semester");
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  
  const getSelectedCourseId = (blockId: string): string | null => {
    return selections.find(s => s.blockId === blockId)?.courseId ?? null;
  };

  const handleWeekClick = (index: number) => {
    setSelectedWeekIndex(index);
    setView("week");
  };

  const handleBackToSemester = () => {
    setView("semester");
  };

  const isCourseInWeek = (course: Course, weekStart: Date): boolean => {
    const courseStart = new Date(course.schedule.startDate);
    const courseEnd = new Date(course.schedule.endDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return courseStart <= weekEnd && courseEnd >= weekStart;
  };

  const getCoursesForWeek = (weekIndex: number) => {
    const weekStart = weeks[weekIndex];
    return courses.filter(course => isCourseInWeek(course, weekStart));
  };

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      {view === "semester" ? (
        <SemesterView
          courses={courses}
          blocks={blocks}
          weeks={weeks}
          selections={selections}
          selectedWeekIndex={selectedWeekIndex}
          onSelectCourse={onSelectCourse}
          onWeekClick={handleWeekClick}
          getSelectedCourseId={getSelectedCourseId}
        />
      ) : (
        <WeekView
          weekIndex={selectedWeekIndex}
          weekStart={weeks[selectedWeekIndex]}
          courses={getCoursesForWeek(selectedWeekIndex)}
          blocks={blocks}
          selections={selections}
          totalWeeks={weeks.length}
          onWeekChange={setSelectedWeekIndex}
          onBack={handleBackToSemester}
          onSelectCourse={onSelectCourse}
          getSelectedCourseId={getSelectedCourseId}
        />
      )}
    </div>
  );
}

// Semester Gantt View
interface SemesterViewProps {
  courses: Course[];
  blocks: CourseBlock[];
  weeks: Date[];
  selections: Selection[];
  selectedWeekIndex: number;
  onSelectCourse: (blockId: string, courseId: string | null) => void;
  onWeekClick: (index: number) => void;
  getSelectedCourseId: (blockId: string) => string | null;
}

function SemesterView({
  courses,
  blocks,
  weeks,
  selections,
  selectedWeekIndex,
  onSelectCourse,
  onWeekClick,
  getSelectedCourseId,
}: SemesterViewProps) {
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

  return (
    <>
      <div className="p-3 border-b border-border bg-slate-50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Семестр</h3>
          <p className="text-xs text-muted-foreground">
            Нажмите на неделю для просмотра расписания →
          </p>
        </div>
      </div>

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
            <div className="w-44 shrink-0 px-3 py-2 text-xs text-muted-foreground" />
            <div className="flex-1 flex">
              {weeks.map((week, index) => (
                <button
                  key={index}
                  onClick={() => onWeekClick(index)}
                  className={cn(
                    "flex-1 min-w-[50px] py-2 text-center text-[11px] border-r border-border/50 last:border-r-0 transition-all hover:bg-blue-100 group",
                    selectedWeekIndex === index && "bg-blue-50"
                  )}
                >
                  <span className="group-hover:font-medium">{formatWeekDate(week)}</span>
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
                      className={cn("flex border-t border-border/30", isDisabled && "opacity-30")}
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

                          return (
                            <button
                              key={index}
                              onClick={() => onWeekClick(index)}
                              className="flex-1 min-w-[50px] h-7 flex items-center px-[2px] hover:bg-blue-50 transition-colors"
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
                            </button>
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
    </>
  );
}

// Week Calendar View
interface WeekViewProps {
  weekIndex: number;
  weekStart: Date;
  courses: Course[];
  blocks: CourseBlock[];
  selections: Selection[];
  totalWeeks: number;
  onWeekChange: (index: number) => void;
  onBack: () => void;
  onSelectCourse: (blockId: string, courseId: string | null) => void;
  getSelectedCourseId: (blockId: string) => string | null;
}

function WeekView({ 
  weekIndex, 
  weekStart, 
  courses, 
  blocks, 
  selections, 
  totalWeeks,
  onWeekChange,
  onBack,
  onSelectCourse,
  getSelectedCourseId,
}: WeekViewProps) {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
  };

  const DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6];
  const HOURS = Array.from({ length: 13 }, (_, i) => i + 8);

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
  }, [courses, getSelectedCourseId]);

  return (
    <>
      {/* Header */}
      <div className="p-3 border-b border-border bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Семестр
            </Button>
            
            <div className="h-6 w-px bg-border" />

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onWeekChange(Math.max(0, weekIndex - 1))}
              disabled={weekIndex === 0}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            
            <div className="text-center min-w-[200px]">
              <span className="font-semibold">Неделя {weekIndex + 1}</span>
              <span className="text-muted-foreground text-sm ml-2">
                {formatDate(weekStart)} — {formatDate(weekEnd)}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onWeekChange(Math.min(totalWeeks - 1, weekIndex + 1))}
              disabled={weekIndex === totalWeeks - 1}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="p-4">
        <div className="grid grid-cols-[50px_repeat(6,1fr)] gap-px bg-border rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-slate-100 p-2" />
          {DAYS.map(day => (
            <div key={day} className="bg-slate-100 p-2 text-center">
              <div className="font-medium text-sm">{DAY_NAMES[day]}</div>
            </div>
          ))}

          {/* Time + days */}
          <div className="bg-white">
            {HOURS.map(hour => (
              <div key={hour} className="h-12 flex items-start justify-end pr-2 text-xs text-muted-foreground border-t border-border/50 first:border-t-0">
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
                style={{ height: `${HOURS.length * 48}px` }}
              >
                {HOURS.map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-full border-t border-border/30"
                    style={{ top: `${(i / HOURS.length) * 100}%` }}
                  />
                ))}

                {daySlots.map(({ course, slot, isSelected }, idx) => {
                  const block = blocks.find(b => b.id === course.blockId);
                  if (!block) return null;
                  const colors = BLOCK_COLORS[block.color];
                  const selectedInBlock = getSelectedCourseId(block.id);
                  const isDisabled = selectedInBlock !== null && selectedInBlock !== course.id;
                  const isFull = course.status === "full";

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!isFull || isSelected) {
                          onSelectCourse(block.id, isSelected ? null : course.id);
                        }
                      }}
                      disabled={isFull && !isSelected}
                      className={cn(
                        "absolute left-1 right-1 rounded px-2 py-1 overflow-hidden text-left transition-all",
                        isSelected 
                          ? `${colors.bg} text-white shadow-md` 
                          : `${colors.light} ${colors.text} border ${colors.border} hover:shadow-md`,
                        isDisabled && "opacity-30 pointer-events-none",
                        isFull && !isSelected && "cursor-not-allowed"
                      )}
                      style={{
                        top: `${timeToPercent(slot.startTime)}%`,
                        height: `${durationToPercent(slot.startTime, slot.endTime)}%`,
                        minHeight: "36px"
                      }}
                    >
                      <div className="font-medium text-xs truncate">
                        {course.shortTitle || course.title}
                      </div>
                      <div className={cn(
                        "text-[10px] truncate",
                        isSelected ? "text-white/80" : "text-muted-foreground"
                      )}>
                        {slot.startTime}–{slot.endTime}
                        {slot.room && ` • ауд. ${slot.room}`}
                      </div>
                      {isFull && !isSelected && (
                        <div className="text-[9px] text-amber-600 font-medium">мест нет</div>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 pb-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span>Кликните на курс, чтобы выбрать или отменить выбор</span>
        <div className="flex items-center gap-4 ml-auto">
          {blocks.map(block => {
            const colors = BLOCK_COLORS[block.color];
            const hasCoursesThisWeek = courses.some(c => c.blockId === block.id);
            if (!hasCoursesThisWeek) return null;
            
            return (
              <div key={block.id} className="flex items-center gap-1.5">
                <div className={cn("w-3 h-3 rounded", colors.bg)} />
                <span>{block.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
