// src/features/course-management/ui/offering-list-page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button, Input, Spinner } from "@/shared/ui";
import { OfferingTable } from "./offering-table";
import {
  getCourseOfferings,
  getCourses,
} from "@/features/course-management/api/courses";
import type { Course, CourseOffering } from "@/entities/course";

export function OfferingListPage() {
  const [offerings, setOfferings] = useState<CourseOffering[]>([]);
  const [courses, setCourses] = useState<Map<string, Course>>(new Map());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [offeringsData, coursesData] = await Promise.all([
        getCourseOfferings({ limit: 200 }),
        getCourses({ limit: 200, is_active: true }),
      ]);

      setOfferings(offeringsData);

      const coursesMap = new Map<string, Course>();
      coursesData.forEach((course) => {
        coursesMap.set(course.id, course);
      });
      setCourses(coursesMap);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredOfferings = offerings.filter((offering) => {
    const course = courses.get(offering.course_id);
    if (!course) return false;

    const searchLower = search.toLowerCase();
    return (
      course.title?.toLowerCase().includes(searchLower) ||
      course.code?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <main className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Открытие курсов</h1>
          <p className="text-muted-foreground">
            {offerings.length} открытых записей
          </p>
        </div>
        <Link href="/admin/offerings/create">
          <Button className="gap-2">
            <Plus className="size-4" />
            Открыть запись
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию курса..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-card rounded-xl border p-8 text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      ) : (
        <OfferingTable offerings={filteredOfferings} courses={courses} />
      )}
    </main>
  );
}
