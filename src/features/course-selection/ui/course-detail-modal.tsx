// src/features/course-selection/ui/course-detail-modal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Badge,
  Progress,
} from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { DisplayCourse } from "@/entities/course";
import {
  formatDate,
  formatTerm,
  getStatusLabel,
  getStatusVariant,
  pluralizeSeats,
} from "@/entities/course";
import { Calendar, Clock, Users } from "lucide-react";

interface CourseDetailModalProps {
  course: DisplayCourse | null;
  isSelected: boolean;
  isSubmitted: boolean;
  onClose: () => void;
  onToggleSelect: () => void;
}

export function CourseDetailModal({
  course,
  isSelected,
  isSubmitted,
  onClose,
  onToggleSelect,
}: CourseDetailModalProps) {
  if (!course) return null;

  const canSelect = course.status === "open" && !isSubmitted;
  const isFull = course.status === "full";
  const progressVariant = isFull ? "destructive" : "default";

  return (
    <Dialog open={!!course} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          {course.code && (
            <Badge variant="outline" className="w-fit mb-2 font-mono text-xs">
              {course.code}
            </Badge>
          )}
          <DialogTitle className="text-xl leading-tight">
            {course.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Description */}
          {course.description && (
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {course.description}
              </p>
            </div>
          )}

          {/* Meta info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Семестр:</span>
              <span className="font-medium">
                {formatTerm(course.term)} {course.year}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Clock className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Запись:</span>
              <span className="font-medium">
                {formatDate(course.enrollmentOpen)} —{" "}
                {formatDate(course.enrollmentClose)}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Users className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Статус:</span>
              <Badge variant={getStatusVariant(course.status)}>
                {getStatusLabel(course.status)}
              </Badge>
            </div>
          </div>

          {/* Enrollment progress */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Записалось студентов</span>
              <span className="font-medium tabular-nums">
                {course.enrolled} / {course.capacity}
              </span>
            </div>
            <Progress
              value={course.enrolled}
              max={course.capacity}
              variant={progressVariant}
            />
            <p
              className={cn(
                "text-sm text-center font-medium",
                course.availableSeats === 0 && "text-destructive",
                course.availableSeats > 0 &&
                  course.availableSeats <= 5 &&
                  "text-amber-600"
              )}
            >
              {course.availableSeats === 0
                ? "Мест нет"
                : `${course.availableSeats} ${pluralizeSeats(course.availableSeats)} доступно`}
            </p>
          </div>

          {/* Actions */}
          {!isSubmitted && (
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Закрыть
              </Button>
              <Button
                onClick={() => {
                  onToggleSelect();
                  onClose();
                }}
                disabled={!canSelect && !isSelected}
                variant={isSelected ? "destructive" : "default"}
                className="flex-1"
              >
                {isSelected
                  ? "Отменить выбор"
                  : !canSelect
                    ? isFull
                      ? "Мест нет"
                      : "Запись закрыта"
                    : "Выбрать курс"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

