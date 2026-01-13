// src/components/CourseCalendar.tsx
"use client";

import { useMemo } from "react";
import { Course, CourseBlock, BLOCK_COLORS, DAY_NAMES_FULL, DayOfWeek, Selection } from "@/types";
import { cn } from "@/lib/utils";

interface CourseCalendarProps {
  courses: Course[];
  blocks: CourseBlock[];
  selections: Selection[];
  onSelectCourse: (blockId: string, courseId: string | null) => void;
}

// Временные слоты с 8:00 до 20:00
const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => {
  const hour = i + 8;
  return `${String(hour).padStart(2, "0")}:00`;
});

// Дни недели (без воскресенья)
const WEEK_DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6];

export function CourseCalendar({ 
  courses, 
  blocks, 
  selections, 
  onSelectCourse 
}: CourseCalendarProps) {
  
  const getSelectedCourseId = (blockId: string): string | null => {
    return selections.find(s => s.blockId === blockId)?.courseId ?? null;
  };

  // Преобразуем время в минуты от начала дня
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Получаем позицию и высоту блока в календаре
  const getSlotStyle = (startTime: string, endTime: string) => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const dayStartMinutes = timeToMinutes("08:00");
    
    const top = ((startMinutes - dayStartMinutes) / 60) * 60; // 60px на час
    const height = ((endMinutes - startMinutes) / 60) * 60;
    
    return { top, height };
  };

  // Группируем курсы по дням
  const coursesByDay = useMemo(() => {
    const result: Record<DayOfWeek, Array<{ course: Course; slot: typeof courses[0]["schedule"]["slots"][0] }>> = {
      0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
    };

    courses.forEach(course => {
      course.schedule.slots.forEach(slot => {
        result[slot.dayOfWeek].push({ course, slot });
      });
    });

    return result;
  }, [courses]);

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      {/* Header with days */}
      <div className="grid grid-cols-[60px_repeat(6,1fr)] border-b border-border bg-slate-50">
        <div className="p-2 border-r border-border" />
        {WEEK_DAYS.map(day => (
          <div 
            key={day} 
            className="p-3 text-center border-r border-border last:border-r-0"
          >
            <div className="font-medium text-sm">{DAY_NAMES_FULL[day]}</div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="grid grid-cols-[60px_repeat(6,1fr)] relative">
        {/* Time labels */}
        <div className="border-r border-border">
          {TIME_SLOTS.map((time, index) => (
            <div 
              key={time} 
              className="h-[60px] flex items-start justify-end pr-2 pt-0 text-xs text-muted-foreground -mt-2"
              style={{ marginTop: index === 0 ? 0 : undefined }}
            >
              {time}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {WEEK_DAYS.map(day => {
          const dayCourses = coursesByDay[day];

          return (
            <div 
              key={day} 
              className="relative border-r border-border last:border-r-0"
              style={{ height: `${TIME_SLOTS.length * 60}px` }}
            >
              {/* Hour lines */}
              {TIME_SLOTS.map((_, index) => (
                <div 
                  key={index}
                  className="absolute w-full border-t border-border/50"
                  style={{ top: `${index * 60}px` }}
                />
              ))}

              {/* Course blocks */}
              {dayCourses.map(({ course, slot }, index) => {
                const block = blocks.find(b => b.id === course.blockId);
                if (!block) return null;

                const colors = BLOCK_COLORS[block.color];
                const selectedCourseId = getSelectedCourseId(block.id);
                const isSelected = selectedCourseId === course.id;
                const isDisabled = selectedCourseId !== null && selectedCourseId !== course.id;
                const isFull = course.status === "full";
                
                const { top, height } = getSlotStyle(slot.startTime, slot.endTime);

                return (
                  <button
                    key={`${course.id}-${index}`}
                    onClick={() => {
                      if (!isFull || isSelected) {
                        onSelectCourse(block.id, isSelected ? null : course.id);
                      }
                    }}
                    disabled={isFull && !isSelected}
                    className={cn(
                      "absolute left-1 right-1 rounded-md p-2 text-left transition-all overflow-hidden group",
                      "hover:ring-2 hover:ring-offset-1",
                      isSelected 
                        ? `${colors.bg} text-white ring-2 ring-offset-1` 
                        : `${colors.light} ${colors.text} hover:${colors.border}`,
                      isDisabled && "opacity-30 pointer-events-none",
                      isFull && !isSelected && "cursor-not-allowed opacity-60"
                    )}
                    style={{ 
                      top: `${top}px`, 
                      height: `${height}px`,
                      minHeight: "40px"
                    }}
                  >
                    {/* Selection indicator */}
                    <div className={cn(
                      "absolute top-1.5 right-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                      isSelected 
                        ? "bg-white/30 border-white/50" 
                        : `border-current opacity-50 group-hover:opacity-100`
                    )}>
                      {isSelected && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    <div className="pr-5">
                      <div className={cn(
                        "font-medium text-xs leading-tight truncate",
                        isSelected ? "text-white" : colors.text
                      )}>
                        {course.shortTitle || course.title}
                      </div>
                      {height >= 60 && (
                        <div className={cn(
                          "text-[10px] mt-0.5 truncate",
                          isSelected ? "text-white/80" : "text-muted-foreground"
                        )}>
                          {course.instructor}
                        </div>
                      )}
                      {height >= 80 && (
                        <div className={cn(
                          "text-[10px] mt-1",
                          isSelected ? "text-white/70" : "text-muted-foreground"
                        )}>
                          {slot.startTime}–{slot.endTime}
                        </div>
                      )}
                      {height >= 100 && slot.room && (
                        <div className={cn(
                          "text-[10px]",
                          isSelected ? "text-white/70" : "text-muted-foreground"
                        )}>
                          Ауд. {slot.room}
                        </div>
                      )}
                    </div>

                    {/* Full indicator */}
                    {isFull && !isSelected && (
                      <div className="absolute bottom-1 left-2 text-[9px] text-amber-600 font-medium">
                        мест нет
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="p-3 border-t border-border bg-slate-50">
        <div className="flex flex-wrap gap-4">
          {blocks.map(block => {
            const colors = BLOCK_COLORS[block.color];
            const selectedId = getSelectedCourseId(block.id);
            const selectedCourse = selectedId ? courses.find(c => c.id === selectedId) : null;

            return (
              <div key={block.id} className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded", colors.bg)} />
                <span className="text-xs text-muted-foreground">
                  {block.name}
                  {selectedCourse && (
                    <span className={cn("ml-1 font-medium", colors.text)}>
                      — {selectedCourse.shortTitle || selectedCourse.title}
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

