// src/components/CourseCard.tsx
import Link from "next/link";
import { Course } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const availableSpots = course.maxStudents - course.enrolledStudents;
  const fillPercentage = (course.enrolledStudents / course.maxStudents) * 100;

  const statusConfig = {
    open: { label: "Открыт", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    full: { label: "Мест нет", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    closed: { label: "Закрыт", className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
    cancelled: { label: "Отменён", className: "bg-red-500/10 text-red-500 border-red-500/20" },
  };

  const status = statusConfig[course.status];

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:bg-card/80">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <CardHeader className="relative space-y-3 pb-3">
        <div className="flex items-start justify-between gap-3">
          <Badge variant="outline" className={cn("shrink-0", status.className)}>
            {status.label}
          </Badge>
          <span className="text-xs font-medium text-muted-foreground">
            {course.credits} кредит{course.credits === 1 ? "" : course.credits < 5 ? "а" : "ов"}
          </span>
        </div>
        
        <div>
          <Link href={`/courses/${course.id}`}>
            <h3 className="text-lg font-semibold leading-tight tracking-tight transition-colors group-hover:text-primary">
              {course.title}
            </h3>
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">
            {course.instructor}
          </p>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4 pb-3">
        <p className="line-clamp-2 text-sm text-muted-foreground/80">
          {course.description}
        </p>

        {/* Schedule */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            {course.schedule.dayOfWeek.join(", ")} • {course.schedule.startTime}–{course.schedule.endTime}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <span>
            {course.schedule.building}, ауд. {course.schedule.room}
          </span>
        </div>

        {/* Enrollment progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Записалось</span>
            <span className={cn(
              "font-medium",
              availableSpots <= 3 ? "text-amber-500" : "text-muted-foreground"
            )}>
              {course.enrolledStudents} / {course.maxStudents}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                fillPercentage >= 90 ? "bg-amber-500" : "bg-primary"
              )}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {course.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="relative pt-0">
        <Link href={`/courses/${course.id}`} className="w-full">
          <Button 
            variant={course.status === "open" ? "default" : "secondary"} 
            className="w-full"
            disabled={course.status === "cancelled"}
          >
            {course.status === "open" 
              ? "Подробнее" 
              : course.status === "full" 
                ? "В лист ожидания"
                : "Просмотреть"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

