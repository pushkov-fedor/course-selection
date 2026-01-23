// src/features/course-management/ui/course-edit-page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CourseForm, type CourseFormData } from "./course-form";
import { getCourse, updateCourse } from "../api";
import type { Course } from "@/entities/course";
import { Spinner } from "@/shared/ui";
import { ArrowLeft } from "lucide-react";

interface CourseEditPageProps {
  courseId: string;
}

export function CourseEditPage({ courseId }: CourseEditPageProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  async function loadCourse() {
    try {
      const data = await getCourse(courseId);
      setCourse(data);
    } catch (err) {
      console.error("Failed to load course:", err);
      setError("Не удалось загрузить курс");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (data: CourseFormData) => {
    await updateCourse(courseId, {
      id: courseId,
      ...data,
    });
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="text-center py-12">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">{error || "Курс не найден"}</h1>
          <Link href="/admin" className="text-primary hover:underline">
            Вернуться к списку
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Назад к списку
        </Link>
        <h1 className="text-2xl font-bold">Редактирование курса</h1>
        <p className="text-muted-foreground">{course.title || "Без названия"}</p>
      </div>

      <CourseForm course={course} onSubmit={handleSubmit} />
    </main>
  );
}

