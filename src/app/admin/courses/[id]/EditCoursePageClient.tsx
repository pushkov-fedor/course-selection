// src/app/admin/courses/[id]/EditCoursePageClient.tsx
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { CourseForm, CourseFormData } from "@/components/admin/CourseForm";
import { courseBlocks, getCourseById } from "@/lib/mock-data";

interface EditCoursePageClientProps {
  courseId: string;
}

export function EditCoursePageClient({ courseId }: EditCoursePageClientProps) {
  const router = useRouter();
  const course = getCourseById(courseId);

  if (!course) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Курс не найден</h1>
          <Link href="/admin">
            <button className="text-blue-600 hover:underline">Вернуться к списку</button>
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = async (data: CourseFormData) => {
    // Симуляция отправки на сервер
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: отправить на бэкенд
    console.log("Обновление курса:", courseId, data);
    router.push("/admin");
  };

  return (
    <main className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад к списку
        </Link>
        <h1 className="text-2xl font-bold">Редактирование курса</h1>
        <p className="text-muted-foreground">{course.title}</p>
      </div>

      <CourseForm course={course} blocks={courseBlocks} onSubmit={handleSubmit} />
    </main>
  );
}

