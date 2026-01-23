// src/features/course-selection/ui/switch-modal.tsx
"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Badge,
  Spinner,
} from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { DisplayCourse } from "@/entities/course";
import { formatTerm, pluralizeSeats } from "@/entities/course";
import {
  Check,
  X,
  Minus,
  Plus,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

interface SwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseToReplace: DisplayCourse | null;
  availableCourses: DisplayCourse[];
  enrolledOfferingIds: string[];
  onSubmit: (oldOfferingId: string, newOfferingId: string) => Promise<void>;
}

type Step = "select" | "confirm" | "submitting" | "success" | "error";

export function SwitchModal({
  isOpen,
  onClose,
  courseToReplace,
  availableCourses,
  enrolledOfferingIds,
  onSubmit,
}: SwitchModalProps) {
  const [step, setStep] = useState<Step>("select");
  const [selectedNewCourse, setSelectedNewCourse] =
    useState<DisplayCourse | null>(null);
  const [error, setError] = useState<string>("");

  const selectableCourses = useMemo(() => {
    return availableCourses.filter(
      (course) =>
        !enrolledOfferingIds.includes(course.offeringId) &&
        course.status === "open" &&
        course.availableSeats > 0
    );
  }, [availableCourses, enrolledOfferingIds]);

  const handleSelectCourse = (course: DisplayCourse) => {
    setSelectedNewCourse(course);
    setStep("confirm");
  };

  const handleConfirm = async () => {
    if (!courseToReplace || !selectedNewCourse) return;

    setStep("submitting");
    setError("");

    try {
      await onSubmit(courseToReplace.offeringId, selectedNewCourse.offeringId);
      setStep("success");
    } catch (err) {
      setStep("error");
      setError(
        err instanceof Error ? err.message : "Не удалось выполнить замену"
      );
    }
  };

  const handleClose = () => {
    setStep("select");
    setSelectedNewCourse(null);
    setError("");
    onClose();
  };

  const handleBack = () => {
    setStep("select");
    setSelectedNewCourse(null);
    setError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[600px] max-h-[85vh] p-0 gap-0 overflow-hidden"
        showCloseButton={step === "select" || step === "confirm"}
      >
        {step === "select" && (
          <>
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <DialogTitle className="flex items-center gap-2">
                <RefreshCw className="size-5" />
                Замена курса
              </DialogTitle>
              {courseToReplace && (
                <div className="mt-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <Minus className="size-4 shrink-0" />
                    <span className="font-medium">{courseToReplace.title}</span>
                  </div>
                </div>
              )}
            </DialogHeader>

            <div
              className="px-6 py-4 overflow-y-auto"
              style={{ maxHeight: "calc(85vh - 200px)" }}
            >
              <p className="text-sm text-muted-foreground mb-4">
                Выберите новый курс ({selectableCourses.length} доступно):
              </p>
              <div className="space-y-2">
                {selectableCourses.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <X className="size-12 mx-auto mb-3 opacity-20" />
                    <p className="font-medium">Нет доступных курсов</p>
                    <p className="text-sm mt-1">
                      Все курсы уже выбраны или заполнены
                    </p>
                  </div>
                ) : (
                  selectableCourses.map((course, index) => (
                    <button
                      key={course.offeringId}
                      onClick={() => handleSelectCourse(course)}
                      className={cn(
                        "w-full p-4 rounded-xl border bg-card text-left transition-all",
                        "hover:border-primary hover:shadow-md",
                        "opacity-0 animate-fade-in-up group"
                      )}
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            {course.code && (
                              <Badge variant="outline" className="text-xs">
                                {course.code}
                              </Badge>
                            )}
                            <Badge variant="success" className="text-xs">
                              {course.availableSeats}{" "}
                              {pluralizeSeats(course.availableSeats)}
                            </Badge>
                          </div>
                          <p className="font-medium text-sm group-hover:text-primary transition-colors">
                            {course.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTerm(course.term)} {course.year}
                          </p>
                        </div>
                        <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-muted/30">
              <Button variant="outline" onClick={handleClose} className="w-full">
                Отмена
              </Button>
            </div>
          </>
        )}

        {step === "confirm" && courseToReplace && selectedNewCourse && (
          <>
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <DialogTitle>Подтверждение замены</DialogTitle>
              <DialogDescription>
                Проверьте детали перед отправкой
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 py-6 space-y-4">
              <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-8 rounded-full bg-destructive/20 flex items-center justify-center">
                    <Minus className="size-4 text-destructive" />
                  </div>
                  <span className="text-sm font-medium text-destructive">
                    Убрать
                  </span>
                </div>
                <p className="ml-11 font-medium">{courseToReplace.title}</p>
              </div>

              <div className="flex justify-center">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <RefreshCw className="size-4 text-primary" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-success/5 border border-success/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-8 rounded-full bg-success/20 flex items-center justify-center">
                    <Plus className="size-4 text-success" />
                  </div>
                  <span className="text-sm font-medium text-success">
                    Добавить
                  </span>
                </div>
                <p className="ml-11 font-medium">{selectedNewCourse.title}</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-muted/30 flex gap-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Назад
              </Button>
              <Button onClick={handleConfirm} className="flex-1">
                Подтвердить
              </Button>
            </div>
          </>
        )}

        {step === "submitting" && (
          <div className="py-16 text-center px-6">
            <Spinner size="lg" className="mx-auto mb-4" />
            <p className="font-medium">Отправка заявки...</p>
            <p className="text-sm text-muted-foreground mt-2">
              Пожалуйста, подождите
            </p>
          </div>
        )}

        {step === "success" && courseToReplace && selectedNewCourse && (
          <>
            <div className="py-12 text-center px-6">
              <div className="mx-auto size-16 rounded-full bg-success/10 flex items-center justify-center mb-4 animate-scale-in">
                <Check className="size-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Готово!</h3>
              <p className="text-muted-foreground mb-6">Курс успешно заменен</p>

              <div className="space-y-2 text-left max-w-sm mx-auto">
                <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-2 text-sm">
                  <Minus className="size-4 text-muted-foreground shrink-0" />
                  <span className="line-through text-muted-foreground">
                    {courseToReplace.title}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-success/5 border border-success/20 flex items-center gap-2 text-sm">
                  <Plus className="size-4 text-success shrink-0" />
                  <span className="font-medium">{selectedNewCourse.title}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-muted/30">
              <Button onClick={handleClose} className="w-full">
                Закрыть
              </Button>
            </div>
          </>
        )}

        {step === "error" && (
          <>
            <div className="py-12 text-center px-6">
              <div className="mx-auto size-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <X className="size-8 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ошибка</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>

            <div className="px-6 py-4 border-t bg-muted/30 flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Закрыть
              </Button>
              <Button onClick={handleConfirm} className="flex-1">
                Повторить
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

