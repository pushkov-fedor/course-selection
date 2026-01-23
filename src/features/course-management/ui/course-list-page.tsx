// src/features/course-management/ui/course-list-page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Course } from "@/entities/course";
import { getCourses, deleteCourse } from "../api";
import { CourseTable } from "./course-table";
import { Button, Input, Spinner } from "@/shared/ui";
import { Plus, Search } from "lucide-react";

export function CourseListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    setLoading(true);
    try {
      // Load all courses (active and inactive)
      const [activeCourses, inactiveCourses] = await Promise.all([
        getCourses({ limit: 200, is_active: true }),
        getCourses({ limit: 200, is_active: false }),
      ]);

      const allCourses = [...activeCourses, ...inactiveCourses];
      allCourses.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
      setCourses(allCourses);
    } catch (error) {
      console.error("Failed to load courses:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(courseId: string) {
    if (!confirm("Вы уверены, что хотите удалить этот курс?")) return;

    try {
      await deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert("Не удалось удалить курс");
    }
  }

  const filteredCourses = courses.filter((course) => {
    const searchLower = search.toLowerCase();
    return (
      (course.title || "").toLowerCase().includes(searchLower) ||
      (course.code || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <main className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Курсы</h1>
          <p className="text-muted-foreground">{courses.length} курсов в системе</p>
        </div>
        <Link href="/admin/courses/create">
          <Button className="gap-2">
            <Plus className="size-4" />
            Создать курс
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или коду..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-card rounded-xl border p-8 text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Загрузка курсов...</p>
        </div>
      ) : (
        <CourseTable courses={filteredCourses} onDelete={handleDelete} />
      )}
    </main>
  );
}
