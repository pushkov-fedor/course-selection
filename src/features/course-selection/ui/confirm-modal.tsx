// src/features/course-selection/ui/confirm-modal.tsx
"use client";

import { useState } from "react";
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
import { cn, getErrorMessage } from "@/shared/lib";
import type { DisplayCourse } from "@/entities/course";
import { formatTerm, pluralizeCourses } from "@/entities/course";
import { Check, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourses: DisplayCourse[];
  onConfirm: () => Promise<void>;
}

type Step = "review" | "submitting" | "success" | "error";

export function ConfirmModal({
  isOpen,
  onClose,
  selectedCourses,
  onConfirm,
}: ConfirmModalProps) {
  const [step, setStep] = useState<Step>("review");
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    setStep("submitting");
    setError("");

    try {
      await onConfirm();
      setStep("success");
    } catch (err) {
      setStep("error");
      setError(getErrorMessage(err, "Произошла ошибка при отправке"));
    }
  };

  const handleClose = () => {
    setStep("review");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[480px] max-h-[90vh] overflow-y-auto" showCloseButton={step === "review"}>
        {step === "review" && (
          <>
            <DialogHeader>
              <DialogTitle>Подтверждение записи</DialogTitle>
              <DialogDescription>
                Проверьте выбранные курсы перед отправкой
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {selectedCourses.map((course, index) => (
                  <div
                    key={course.offeringId}
                    className={cn(
                      "p-3 rounded-lg border bg-muted/30 opacity-0 animate-fade-in-up"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="size-3.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {course.code && (
                          <Badge variant="outline" className="mb-1 text-xs">
                            {course.code}
                          </Badge>
                        )}
                        <p className="font-medium text-sm">{course.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatTerm(course.term)} {course.year}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                <span className="text-sm font-medium">Всего курсов</span>
                <span className="text-lg font-bold text-primary">
                  {selectedCourses.length}
                </span>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Назад
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                Подтвердить
              </Button>
            </div>
          </>
        )}

        {step === "submitting" && (
          <div className="py-12 text-center">
            <Spinner size="lg" className="mx-auto mb-4" />
            <p className="text-muted-foreground">Отправка заявки...</p>
          </div>
        )}

        {step === "success" && (
          <div className="py-8 text-center">
            <div className="mx-auto size-16 rounded-full bg-success/10 flex items-center justify-center mb-4 animate-scale-in">
              <Check className="size-8 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Заявка отправлена!</h3>
            <p className="text-muted-foreground mb-6">
              Вы успешно записались на {selectedCourses.length}{" "}
              {pluralizeCourses(selectedCourses.length)}.
            </p>
            <Button onClick={handleClose} className="w-full">
              Готово
            </Button>
          </div>
        )}

        {step === "error" && (
          <div className="py-8 text-center">
            <div className="mx-auto size-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <X className="size-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ошибка</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Закрыть
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                Повторить
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

