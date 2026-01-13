// src/app/courses/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { CourseCard } from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockCourses, departments } from "@/lib/mock-data";
import { Course, CourseStatus } from "@/types";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "table";

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filteredCourses = useMemo(() => {
    return mockCourses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.instructor.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase());

      const matchesDepartment =
        selectedDepartment === "all" || course.department === selectedDepartment;

      const matchesStatus =
        selectedStatus === "all" || course.status === selectedStatus;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [search, selectedDepartment, selectedStatus]);

  const clearFilters = () => {
    setSearch("");
    setSelectedDepartment("all");
    setSelectedStatus("all");
  };

  const hasActiveFilters = search || selectedDepartment !== "all" || selectedStatus !== "all";

  return (
    <div className="min-h-screen bg-grid-pattern">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Каталог курсов</h1>
          <p className="mt-2 text-muted-foreground">
            Найдено {filteredCourses.length} курс{filteredCourses.length === 1 ? "" : filteredCourses.length < 5 ? "а" : "ов"}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <Input
                placeholder="Поиск по названию, преподавателю..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Department filter */}
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full sm:w-[240px]">
                <SelectValue placeholder="Факультет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все факультеты</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.shortName} — {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Любой статус</SelectItem>
                <SelectItem value="open">Открыт</SelectItem>
                <SelectItem value="full">Мест нет</SelectItem>
                <SelectItem value="closed">Закрыт</SelectItem>
              </SelectContent>
            </Select>

            {/* View toggle */}
            <div className="flex rounded-lg border border-border p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "flex items-center justify-center h-8 w-8 rounded-md transition-colors",
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={cn(
                  "flex items-center justify-center h-8 w-8 rounded-md transition-colors",
                  viewMode === "table"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Active filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Фильтры:</span>
              {search && (
                <Badge variant="secondary" className="gap-1">
                  Поиск: {search}
                  <button onClick={() => setSearch("")} className="ml-1 hover:text-foreground">
                    ×
                  </button>
                </Badge>
              )}
              {selectedDepartment !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {departments.find(d => d.name === selectedDepartment)?.shortName}
                  <button onClick={() => setSelectedDepartment("all")} className="ml-1 hover:text-foreground">
                    ×
                  </button>
                </Badge>
              )}
              {selectedStatus !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {selectedStatus === "open" ? "Открыт" : selectedStatus === "full" ? "Мест нет" : "Закрыт"}
                  <button onClick={() => setSelectedStatus("all")} className="ml-1 hover:text-foreground">
                    ×
                  </button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
                Сбросить все
              </Button>
            </div>
          )}
        </div>

        {/* Courses */}
        {filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Курсы не найдены</h3>
            <p className="mt-2 text-muted-foreground max-w-sm">
              Попробуйте изменить параметры поиска или сбросить фильтры
            </p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Сбросить фильтры
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <CourseTable courses={filteredCourses} />
        )}
      </main>
    </div>
  );
}

// Table view component
function CourseTable({ courses }: { courses: Course[] }) {
  const statusConfig: Record<CourseStatus, { label: string; className: string }> = {
    open: { label: "Открыт", className: "bg-emerald-500/10 text-emerald-500" },
    full: { label: "Мест нет", className: "bg-amber-500/10 text-amber-500" },
    closed: { label: "Закрыт", className: "bg-zinc-500/10 text-zinc-400" },
    cancelled: { label: "Отменён", className: "bg-red-500/10 text-red-500" },
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Название</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Преподаватель</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Расписание</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Места</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Статус</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {courses.map((course) => {
              const status = statusConfig[course.status];
              return (
                <tr key={course.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium">{course.title}</div>
                      <div className="text-sm text-muted-foreground">{course.credits} кр.</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">{course.instructor}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    <div>{course.schedule.dayOfWeek.join(", ")}</div>
                    <div>{course.schedule.startTime}–{course.schedule.endTime}</div>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {course.enrolledStudents}/{course.maxStudents}
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant="secondary" className={status.className}>
                      {status.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <a href={`/courses/${course.id}`}>
                      <Button variant="ghost" size="sm">
                        Открыть
                      </Button>
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

