// src/components/CourseModal.tsx
"use client";

import { Course, CourseBlock, BLOCK_COLORS, DAY_NAMES_FULL } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CourseModalProps {
  course: Course | null;
  block: CourseBlock | null;
  isSelected: boolean;
  isDisabled: boolean;
  onClose: () => void;
  onSelect: () => void;
}

export function CourseModal({
  course,
  block,
  isSelected,
  isDisabled,
  onClose,
  onSelect,
}: CourseModalProps) {
  if (!course || !block) return null;

  const colors = BLOCK_COLORS[block.color];
  const isFull = course.status === "full";
  const spots = course.maxStudents - course.enrolledStudents;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Dialog open={!!course} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className={cn("w-3 h-3 rounded-full", colors.bg)} />
            <span className={cn("text-sm font-medium", colors.text)}>{block.name}</span>
          </div>
          <DialogTitle className="text-xl">{course.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Instructor */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
              {course.instructor.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <div className="font-medium">{course.instructor}</div>
              <div className="text-sm text-muted-foreground">Преподаватель</div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {course.description}
          </p>

          {/* Meta badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {course.credits} кредит{course.credits === 1 ? "" : course.credits < 5 ? "а" : "ов"}
            </Badge>
            <Badge variant="secondary">
              {course.semester}
            </Badge>
            <Badge 
              variant="secondary" 
              className={cn(isFull && "bg-amber-100 text-amber-700")}
            >
              {isFull ? "Мест нет" : `${spots} свободных мест`}
            </Badge>
          </div>

          {/* Schedule section */}
          <div className="rounded-lg border border-border p-4 space-y-3">
            <h4 className="font-medium text-sm">Расписание</h4>
            
            {/* Dates */}
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span className="text-muted-foreground">Период:</span>
              <span>{formatDate(course.schedule.startDate)} — {formatDate(course.schedule.endDate)}</span>
            </div>

            {/* Time slots */}
            <div className="space-y-2">
              {course.schedule.slots.map((slot, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className={cn("w-2 h-2 rounded-full", colors.bg)} />
                  <span className="font-medium w-28">{DAY_NAMES_FULL[slot.dayOfWeek]}</span>
                  <span>{slot.startTime} – {slot.endTime}</span>
                  {slot.room && (
                    <span className="text-muted-foreground">• ауд. {slot.room}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Enrollment progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Записалось студентов</span>
              <span className="font-medium">{course.enrolledStudents} / {course.maxStudents}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all",
                  isFull ? "bg-amber-500" : colors.bg
                )}
                style={{ width: `${(course.enrolledStudents / course.maxStudents) * 100}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Закрыть
            </Button>
            <Button 
              onClick={() => {
                onSelect();
                onClose();
              }}
              disabled={isDisabled || (isFull && !isSelected)}
              className={cn(
                "flex-1",
                isSelected && "bg-red-500 hover:bg-red-600"
              )}
            >
              {isSelected ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Отменить выбор
                </>
              ) : isDisabled ? (
                "Выбран другой курс"
              ) : isFull ? (
                "Мест нет"
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Выбрать курс
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

