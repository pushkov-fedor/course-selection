// src/features/course-management/ui/course-create-page.tsx
"use client";

import Link from "next/link";
import { CourseForm, type CourseFormData } from "./course-form";
import { createCourse } from "../api";
import { ArrowLeft } from "lucide-react";

export function CourseCreatePage() {
  const handleSubmit = async (data: CourseFormData) => {
    await createCourse({
      code: data.code,
      title: data.title,
      description: data.description,
      is_active: data.is_active,
    });
  };

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
        <h1 className="text-2xl font-bold">Создание курса</h1>
        <p className="text-muted-foreground">Заполните информацию о новом курсе</p>
      </div>

      <CourseForm onSubmit={handleSubmit} />
    </main>
  );
}

