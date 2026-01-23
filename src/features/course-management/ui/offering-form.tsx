// src/features/course-management/ui/offering-form.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import {
  getCourses,
  createCourseOffering,
  updateCourseOffering,
  type CreateCourseOfferingDTO,
  type UpdateCourseOfferingDTO,
} from "@/features/course-management/api/courses";
import type { Course, CourseOffering } from "@/entities/course";

interface OfferingFormProps {
  offering?: CourseOffering;
  isEdit?: boolean;
}

function toLocalDatetimeString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function OfferingForm({ offering, isEdit = false }: OfferingFormProps) {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    course_id: offering?.course_id || "",
    capacity: offering?.capacity?.toString() || "30",
    year: offering?.year?.toString() || new Date().getFullYear().toString(),
    term: offering?.term || ("spring" as "spring" | "fall"),
    enrollment_open: offering?.enrollment_open
      ? toLocalDatetimeString(new Date(offering.enrollment_open))
      : toLocalDatetimeString(new Date()),
    enrollment_close: offering?.enrollment_close
      ? toLocalDatetimeString(new Date(offering.enrollment_close))
      : toLocalDatetimeString(
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        ),
  });

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await getCourses({ limit: 200, is_active: true });
        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    }
    loadCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && offering) {
        const updateData: UpdateCourseOfferingDTO = {
          capacity: parseInt(formData.capacity, 10),
          year: parseInt(formData.year, 10),
          term: formData.term,
          enrollment_open: new Date(formData.enrollment_open).toISOString(),
          enrollment_close: new Date(formData.enrollment_close).toISOString(),
        };
        await updateCourseOffering(offering.id, updateData);
      } else {
        const createData: CreateCourseOfferingDTO = {
          course_id: formData.course_id,
          capacity: parseInt(formData.capacity, 10),
          year: parseInt(formData.year, 10),
          term: formData.term,
          enrollment_open: new Date(formData.enrollment_open).toISOString(),
          enrollment_close: new Date(formData.enrollment_close).toISOString(),
        };
        await createCourseOffering(createData);
      }

      router.push("/admin/offerings");
      router.refresh();
    } catch (err) {
      console.error("Failed to save offering:", err);
      setError("Не удалось сохранить набор");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/offerings">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="size-4 mr-1" />
              Назад
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            {isEdit ? "Редактировать запись" : "Открыть запись на курс"}
          </h1>
        </div>

        {/* Form Card */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Course Selection */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Курс *</label>
              {loadingCourses ? (
                <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
                  <Loader2 className="size-4 animate-spin" />
                  Загрузка курсов...
                </div>
              ) : (
                <select
                  value={formData.course_id}
                  onChange={(e) =>
                    setFormData({ ...formData, course_id: e.target.value })
                  }
                  disabled={isEdit}
                  required
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <option value="">Выберите курс</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                      {course.code && ` (${course.code})`}
                    </option>
                  ))}
                </select>
              )}
              {isEdit && (
                <p className="text-xs text-muted-foreground">
                  Курс нельзя изменить после создания
                </p>
              )}
            </div>

            {/* Year and Term */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Год *</label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  min={2020}
                  max={2050}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Семестр *</label>
                <select
                  value={formData.term}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      term: e.target.value as "spring" | "fall",
                    })
                  }
                  required
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
                >
                  <option value="spring">Весна</option>
                  <option value="fall">Осень</option>
                </select>
              </div>
            </div>

            {/* Capacity */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Количество мест *</label>
              <Input
                type="number"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
                min={1}
                max={1000}
                required
              />
            </div>

            {/* Enrollment Period */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Начало записи *</label>
                <Input
                  type="datetime-local"
                  value={formData.enrollment_open}
                  onChange={(e) =>
                    setFormData({ ...formData, enrollment_open: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Конец записи *</label>
                <Input
                  type="datetime-local"
                  value={formData.enrollment_close}
                  onChange={(e) =>
                    setFormData({ ...formData, enrollment_close: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/admin/offerings">
                <Button type="button" variant="ghost">
                  Отмена
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="size-4 animate-spin mr-2" />
                ) : (
                  <Save className="size-4 mr-2" />
                )}
                {isEdit ? "Сохранить" : "Создать"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}

