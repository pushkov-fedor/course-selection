// src/components/ConfirmationModal.tsx
"use client";

import { useState } from "react";
import { Course, CourseBlock, BLOCK_COLORS, DAY_NAMES } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourses: Course[];
  blocks: CourseBlock[];
  onConfirm: () => void;
}

type Step = "review" | "submitting" | "success";

export function ConfirmationModal({
  isOpen,
  onClose,
  selectedCourses,
  blocks,
  onConfirm,
}: ConfirmationModalProps) {
  const [step, setStep] = useState<Step>("review");

  const totalCredits = selectedCourses.reduce((sum, c) => sum + c.credits, 0);

  const handleSubmit = async () => {
    setStep("submitting");
    
    // Симуляция отправки на сервер
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setStep("success");
    onConfirm();
  };

  const handleClose = () => {
    setStep("review");
    onClose();
  };

  const getBlockForCourse = (course: Course) => {
    return blocks.find(b => b.id === course.blockId);
  };

  // Собираем расписание на неделю
  const weekSchedule = selectedCourses.flatMap(course => 
    course.schedule.slots.map(slot => ({
      course,
      slot,
      block: getBlockForCourse(course),
    }))
  ).sort((a, b) => {
    if (a.slot.dayOfWeek !== b.slot.dayOfWeek) {
      return a.slot.dayOfWeek - b.slot.dayOfWeek;
    }
    return a.slot.startTime.localeCompare(b.slot.startTime);
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        {step === "review" && (
          <>
            <DialogHeader>
              <DialogTitle>Подтверждение записи</DialogTitle>
              <DialogDescription>
                Проверьте выбранные курсы перед отправкой заявки
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Selected courses */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Выбранные курсы ({selectedCourses.length})</h4>
                <div className="space-y-2">
                  {selectedCourses.map(course => {
                    const block = getBlockForCourse(course);
                    if (!block) return null;
                    const colors = BLOCK_COLORS[block.color];

                    return (
                      <div 
                        key={course.id}
                        className={cn("p-3 rounded-lg border", colors.light, colors.border)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className={cn("w-2 h-2 rounded-full", colors.bg)} />
                              <span className="text-xs text-muted-foreground">{block.name}</span>
                            </div>
                            <div className={cn("font-medium mt-0.5", colors.text)}>
                              {course.title}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {course.instructor} • {course.schedule.slots.map(s => 
                                `${DAY_NAMES[s.dayOfWeek]} ${s.startTime}`
                              ).join(", ")}
                            </div>
                          </div>
                          <Badge variant="secondary" className="shrink-0">
                            {course.credits} кр.
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weekly schedule preview */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Расписание на неделю</h4>
                <div className="rounded-lg border border-border p-3 space-y-1.5">
                  {weekSchedule.map(({ course, slot, block }, idx) => {
                    if (!block) return null;
                    const colors = BLOCK_COLORS[block.color];
                    
                    return (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        <span className="w-8 font-medium">{DAY_NAMES[slot.dayOfWeek]}</span>
                        <span className="text-muted-foreground w-24">
                          {slot.startTime}–{slot.endTime}
                        </span>
                        <div className={cn("w-2 h-2 rounded-full", colors.bg)} />
                        <span className="truncate">{course.shortTitle || course.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Всего кредитов</span>
                <span className="text-lg font-semibold">{totalCredits}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Вернуться к выбору
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                Отправить заявку
              </Button>
            </div>
          </>
        )}

        {step === "submitting" && (
          <div className="py-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="mt-4 text-muted-foreground">Отправка заявки...</p>
          </div>
        )}

        {step === "success" && (
          <div className="py-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <DialogTitle className="text-xl mb-2">Заявка отправлена!</DialogTitle>
            <DialogDescription className="mb-6">
              Вы успешно записались на {selectedCourses.length} курс{selectedCourses.length === 1 ? "" : selectedCourses.length < 5 ? "а" : "ов"}.
              <br />
              Информация о расписании будет отправлена на вашу почту.
            </DialogDescription>

            <div className="rounded-lg bg-muted/50 p-4 mb-6 text-left">
              <div className="text-sm space-y-1">
                {selectedCourses.map(course => {
                  const block = getBlockForCourse(course);
                  if (!block) return null;
                  const colors = BLOCK_COLORS[block.color];
                  
                  return (
                    <div key={course.id} className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", colors.bg)} />
                      <span>{course.shortTitle || course.title}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm">
                <span className="text-muted-foreground">Итого</span>
                <span className="font-medium">{totalCredits} кредитов</span>
              </div>
            </div>

            <Button onClick={handleClose} className="w-full">
              Готово
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

