// src/features/course-management/ui/offering-table.tsx
"use client";

import Link from "next/link";
import { Button, Badge } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { CourseOffering, Course } from "@/entities/course";
import { Pencil } from "lucide-react";

interface OfferingTableProps {
  offerings: CourseOffering[];
  courses: Map<string, Course>;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getTermLabel(term: string): string {
  return term === "spring" ? "Весна" : "Осень";
}

function getOfferingStatus(offering: CourseOffering): {
  label: string;
  variant: "default" | "success" | "destructive" | "secondary";
} {
  const now = new Date();
  const open = new Date(offering.enrollment_open);
  const close = new Date(offering.enrollment_close);

  if (now < open) {
    return { label: "Ожидает", variant: "secondary" };
  }
  if (now > close) {
    return { label: "Закрыт", variant: "destructive" };
  }
  if (offering.enrolled >= offering.capacity) {
    return { label: "Мест нет", variant: "destructive" };
  }
  return { label: "Открыт", variant: "success" };
}

export function OfferingTable({ offerings, courses }: OfferingTableProps) {
  if (offerings.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p>Записи не найдены</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50 border-b">
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
              Курс
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
              Семестр
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
              Период записи
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
              Места
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
          {offerings.map((offering) => {
            const course = courses.get(offering.course_id);
            const status = getOfferingStatus(offering);
            const isFull = offering.enrolled >= offering.capacity;

            return (
              <tr
                key={offering.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <div>
                    <div className="flex items-center gap-2">
                      {course?.code && (
                        <Badge variant="outline">{course.code}</Badge>
                      )}
                      <div className="font-medium">
                        {course?.title || "Курс не найден"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    {getTermLabel(offering.term)} {offering.year}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    {formatDate(offering.enrollment_open)} —{" "}
                    {formatDate(offering.enrollment_close)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <span className={cn(isFull && "text-amber-600 font-medium")}>
                      {offering.enrolled}
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      / {offering.capacity}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={status.variant}>{status.label}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/offerings/${offering.id}`}>
                    <Button variant="ghost" size="icon-sm">
                      <Pencil className="size-4" />
                    </Button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

