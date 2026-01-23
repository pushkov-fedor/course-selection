// src/features/course-selection/ui/enrolled-courses.tsx
"use client";

import { Button, Badge, Card } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { DisplayCourse } from "@/entities/course";
import { formatTerm, pluralizeCourses } from "@/entities/course";
import { Check, Info, RefreshCw, BookOpen } from "lucide-react";

interface EnrolledCoursesProps {
  courses: DisplayCourse[];
  onOpenDetails: (course: DisplayCourse) => void;
  onSwitchCourse: (course: DisplayCourse) => void;
}

export function EnrolledCourses({
  courses,
  onOpenDetails,
  onSwitchCourse,
}: EnrolledCoursesProps) {
  return (
    <div className="space-y-6">
      {/* Success banner */}
      <div className="bg-success/5 border border-success/20 rounded-xl p-5 animate-fade-in-up">
        <div className="flex items-start gap-4">
          <div className="size-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
            <Check className="size-6 text-success" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Запись завершена</h3>
            <p className="text-muted-foreground">
              Вы успешно записались на{" "}
              <span className="font-medium text-foreground">
                {courses.length} {pluralizeCourses(courses.length)}
              </span>
              . Вы можете заменить курс на другой в любое время.
            </p>
          </div>
        </div>
      </div>

      {/* Courses header */}
      <div className="flex items-center gap-2">
        <BookOpen className="size-6 text-primary" />
        <h2 className="text-xl font-semibold">Мои курсы</h2>
      </div>

      {/* Courses grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {courses.map((course, index) => (
          <Card
            key={course.offeringId}
            className={cn(
              "opacity-0 animate-fade-in-up border-success/30 hover:border-success/50"
            )}
            style={{ animationDelay: `${(index + 1) * 100}ms` }}
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  {course.code && (
                    <Badge variant="outline" className="mb-2 text-xs font-mono">
                      {course.code}
                    </Badge>
                  )}
                  <h3 className="font-semibold text-base leading-tight mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatTerm(course.term)} {course.year}
                  </p>
                </div>
                <div className="size-9 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                  <Check className="size-5 text-success" />
                </div>
              </div>

              {course.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {course.description}
                </p>
              )}

              <div className="flex gap-2 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenDetails(course)}
                  className="flex-1"
                >
                  <Info className="size-4" />
                  Подробнее
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onSwitchCourse(course)}
                  className="flex-1"
                >
                  <RefreshCw className="size-4" />
                  Заменить
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

