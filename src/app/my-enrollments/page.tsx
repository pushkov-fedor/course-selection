// src/app/my-enrollments/page.tsx
"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCourses, mockStudent } from "@/lib/mock-data";
import { EnrollmentStatus } from "@/types";
import { cn } from "@/lib/utils";

// Моковые заявки студента
const mockEnrollments = [
  {
    id: "enroll-1",
    courseId: "1",
    status: "approved" as EnrollmentStatus,
    priority: 1,
    createdAt: "2026-01-10T14:30:00Z",
  },
  {
    id: "enroll-2",
    courseId: "5",
    status: "pending" as EnrollmentStatus,
    priority: 2,
    createdAt: "2026-01-11T09:15:00Z",
  },
  {
    id: "enroll-3",
    courseId: "7",
    status: "waitlist" as EnrollmentStatus,
    priority: 3,
    createdAt: "2026-01-12T16:45:00Z",
  },
];

const statusConfig: Record<EnrollmentStatus, { label: string; className: string; icon: string }> = {
  draft: { label: "Черновик", className: "bg-zinc-500/10 text-zinc-400", icon: "📝" },
  pending: { label: "На рассмотрении", className: "bg-blue-500/10 text-blue-500", icon: "⏳" },
  approved: { label: "Одобрена", className: "bg-emerald-500/10 text-emerald-500", icon: "✓" },
  rejected: { label: "Отклонена", className: "bg-red-500/10 text-red-500", icon: "✗" },
  waitlist: { label: "Лист ожидания", className: "bg-amber-500/10 text-amber-500", icon: "📋" },
};

export default function MyEnrollmentsPage() {
  const enrollmentsWithCourses = mockEnrollments.map((enrollment) => ({
    ...enrollment,
    course: mockCourses.find((c) => c.id === enrollment.courseId),
  }));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-grid-pattern">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Мои заявки</h1>
          <p className="mt-2 text-muted-foreground">
            Управление заявками на курсы
          </p>
        </div>

        {/* Student info */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-medium text-primary">
                {mockStudent.firstName[0]}{mockStudent.lastName[0]}
              </div>
              <div>
                <div className="font-medium text-lg">
                  {mockStudent.lastName} {mockStudent.firstName} {mockStudent.middleName}
                </div>
                <div className="text-sm text-muted-foreground">
                  {mockStudent.group} • {mockStudent.year} курс • {mockStudent.department}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{mockEnrollments.length}</div>
              <div className="text-sm text-muted-foreground">Всего заявок</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-emerald-500">
                {mockEnrollments.filter((e) => e.status === "approved").length}
              </div>
              <div className="text-sm text-muted-foreground">Одобрено</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-500">
                {mockEnrollments.filter((e) => e.status === "pending").length}
              </div>
              <div className="text-sm text-muted-foreground">На рассмотрении</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-amber-500">
                {mockEnrollments.filter((e) => e.status === "waitlist").length}
              </div>
              <div className="text-sm text-muted-foreground">В листе ожидания</div>
            </CardContent>
          </Card>
        </div>

        {/* Enrollments list */}
        {enrollmentsWithCourses.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Нет заявок</h3>
              <p className="mt-2 text-muted-foreground">
                Вы ещё не подавали заявки на курсы
              </p>
              <Link href="/courses" className="inline-block mt-4">
                <Button>Выбрать курс</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {enrollmentsWithCourses.map((enrollment) => {
              const status = statusConfig[enrollment.status];
              const course = enrollment.course;

              if (!course) return null;

              return (
                <Card key={enrollment.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    {/* Status indicator */}
                    <div className={cn(
                      "sm:w-2 h-2 sm:h-auto",
                      enrollment.status === "approved" && "bg-emerald-500",
                      enrollment.status === "pending" && "bg-blue-500",
                      enrollment.status === "waitlist" && "bg-amber-500",
                      enrollment.status === "rejected" && "bg-red-500",
                      enrollment.status === "draft" && "bg-zinc-500"
                    )} />
                    
                    <div className="flex-1 p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <Link href={`/courses/${course.id}`}>
                              <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                                {course.title}
                              </h3>
                            </Link>
                            <Badge variant="outline" className={status.className}>
                              {status.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {course.instructor} • {course.department}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                            <span>Приоритет: {enrollment.priority}</span>
                            <span>•</span>
                            <span>Подана: {formatDate(enrollment.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/courses/${course.id}`}>
                            <Button variant="outline" size="sm">
                              Подробнее
                            </Button>
                          </Link>
                          {enrollment.status === "draft" && (
                            <Link href={`/courses/${course.id}/enroll`}>
                              <Button size="sm">
                                Продолжить
                              </Button>
                            </Link>
                          )}
                          {(enrollment.status === "pending" || enrollment.status === "waitlist") && (
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                              Отозвать
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Course schedule preview */}
                      <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {course.schedule.dayOfWeek.join(", ")} • {course.schedule.startTime}–{course.schedule.endTime}
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          {course.schedule.building}, ауд. {course.schedule.room}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link href="/courses">
            <Button variant="outline" size="lg">
              Записаться на другие курсы
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

