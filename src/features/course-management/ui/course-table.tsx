// src/features/course-management/ui/course-table.tsx
"use client";

import Link from "next/link";
import { Button, Badge } from "@/shared/ui";
import type { Course } from "@/entities/course";
import { Pencil, Trash2 } from "lucide-react";

interface CourseTableProps {
  courses: Course[];
  onDelete: (courseId: string) => void;
}

export function CourseTable({ courses, onDelete }: CourseTableProps) {
  if (courses.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p>Курсы не найдены</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50 border-b">
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
              Код
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
              Название
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
              Статус
            </th>
            <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {courses.map((course) => (
            <tr
              key={course.id}
              className="hover:bg-muted/30 transition-colors"
            >
              <td className="px-4 py-3">
                {course.code ? (
                  <Badge variant="outline">{course.code}</Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="font-medium">{course.title || "Без названия"}</div>
              </td>
              <td className="px-4 py-3">
                <Badge variant={course.is_active ? "success" : "secondary"}>
                  {course.is_active ? "Активен" : "Неактивен"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/admin/courses/${course.id}`}>
                    <Button variant="ghost" size="icon-sm">
                      <Pencil className="size-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(course.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
