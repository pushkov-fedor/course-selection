// src/features/course-management/ui/course-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Course } from "@/entities/course";
import { Button, Input } from "@/shared/ui";
import { Info } from "lucide-react";

interface CourseFormProps {
  course?: Course;
  onSubmit: (data: CourseFormData) => Promise<void>;
}

export interface CourseFormData {
  code?: string;
  title: string;
  description: string;
  is_active: boolean;
}

export function CourseForm({ course, onSubmit }: CourseFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [code, setCode] = useState(course?.code || "");
  const [title, setTitle] = useState(course?.title || "");
  const [description, setDescription] = useState(
    typeof course?.description === "string"
      ? course.description
      : course?.description
        ? JSON.stringify(course.description, null, 2)
        : ""
  );
  const [isActive, setIsActive] = useState(course?.is_active ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        code: code || undefined,
        title,
        description,
        is_active: isActive,
      });
      router.push("/admin");
    } catch (error) {
      console.error(error);
      alert("Не удалось сохранить курс");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = title.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-card rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Основная информация</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Код курса</label>
            <Input
              value={code}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
              placeholder="Например: CS101"
            />
            <p className="text-xs text-muted-foreground">Опционально</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Название курса *</label>
            <Input
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Например: Машинное обучение"
              required
            />
          </div>

          <div className="sm:col-span-2 space-y-2">
            <label className="text-sm font-medium">Описание *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите содержание курса..."
              required
              rows={6}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Опишите содержание, цели и требования курса
            </p>
          </div>

          <div className="sm:col-span-2 flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="size-4 rounded border-input accent-primary"
            />
            <label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
              Опубликовать курс (виден студентам)
            </label>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <div className="flex gap-3">
          <Info className="size-5 shrink-0 mt-0.5 text-primary" />
          <div className="text-sm">
            <p className="font-medium mb-1">Следующий шаг</p>
            <p className="text-muted-foreground">
              После создания курса откройте запись на него — укажите семестр, год,
              количество мест и период записи.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Отмена
        </Button>
        <Button type="submit" disabled={!isValid} loading={isSubmitting}>
          {course ? "Сохранить изменения" : "Создать курс"}
        </Button>
      </div>
    </form>
  );
}

