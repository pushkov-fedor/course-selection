// src/features/course-selection/ui/course-card.tsx
"use client";

import { Card, Badge, Checkbox, Button } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { DisplayCourse } from "@/entities/course";
import {
  formatTerm,
  getStatusLabel,
  getStatusVariant,
} from "@/entities/course";
import { Info, Users } from "lucide-react";

interface CourseCardProps {
  course: DisplayCourse;
  isSelected: boolean;
  onToggle: () => void;
  onOpenDetails: () => void;
  disabled?: boolean;
  animationDelay?: number;
}

export function CourseCard({
  course,
  isSelected,
  onToggle,
  onOpenDetails,
  disabled = false,
  animationDelay = 0,
}: CourseCardProps) {
  const canSelect = course.status === "open" && course.availableSeats > 0;
  const isDisabled = disabled || !canSelect;

  const isFull = course.status === "full";

  return (
    <Card
      className={cn(
        "relative flex flex-col animate-fade-in-up overflow-hidden",
        isSelected && "ring-2 ring-primary border-primary",
        !isDisabled && "cursor-pointer hover:shadow-md hover:border-primary/30"
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={() => !isDisabled && onToggle()}
    >
      {/* Full course overlay indicator */}
      {isFull && (
        <div className="absolute top-3 right-3 bg-destructive/10 text-destructive text-xs font-medium px-2 py-1 rounded-md">
          Мест нет
        </div>
      )}

      {/* Header */}
      <div className="p-4 sm:p-5 pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {course.code && (
              <Badge variant="outline" className="mb-2.5 font-mono text-xs">
                {course.code}
              </Badge>
            )}
            <h3 className="font-semibold text-base leading-tight mb-1.5">
              {course.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatTerm(course.term)} {course.year}
            </p>
          </div>

          {!isFull && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => !isDisabled && onToggle()}
              disabled={isDisabled}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 pt-3 sm:pt-4 flex-1 flex flex-col gap-2.5 sm:gap-3">
        {course.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        )}

        {/* Status row */}
        <div className="flex items-center justify-between text-sm">
          <Badge variant={getStatusVariant(course.status)}>
            {getStatusLabel(course.status)}
          </Badge>
          <div className={cn(
            "flex items-center gap-1.5 font-medium",
            course.availableSeats === 0 && "text-destructive",
            course.availableSeats > 0 && course.availableSeats <= 5 && "text-amber-600",
            course.availableSeats > 5 && "text-muted-foreground"
          )}>
            <Users className="size-3.5" />
            <span>{course.enrolled}/{course.capacity}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto pt-3 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails();
            }}
          >
            <Info className="size-4" />
            Подробнее
          </Button>
        </div>
      </div>
    </Card>
  );
}
