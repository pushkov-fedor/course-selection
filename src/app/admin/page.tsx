// src/app/admin/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { mockCourses, courseBlocks } from "@/lib/mock-data";
import { BLOCK_COLORS, DAY_NAMES } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AdminCoursesPage() {
  const [search, setSearch] = useState("");
  const [filterBlock, setFilterBlock] = useState<string>("all");

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase());
    const matchesBlock = filterBlock === "all" || course.blockId === filterBlock;
    return matchesSearch && matchesBlock;
  });

  const getBlock = (blockId: string) => courseBlocks.find(b => b.id === blockId);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <main className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Управление курсами</h1>
          <p className="text-muted-foreground">
            {mockCourses.length} курсов в системе
          </p>
        </div>
        <Link href="/admin/courses/create">
          <Button className="gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Создать курс
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <Input
            placeholder="Поиск по названию или преподавателю..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={filterBlock === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterBlock("all")}
          >
            Все
          </Button>
          {courseBlocks.map(block => {
            const colors = BLOCK_COLORS[block.color];
            return (
              <Button
                key={block.id}
                variant={filterBlock === block.id ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterBlock(block.id)}
                className={cn(
                  filterBlock === block.id && colors.bg
                )}
              >
                {block.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-border">
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Курс</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Блок</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Расписание</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Записи</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Статус</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredCourses.map(course => {
              const block = getBlock(course.blockId);
              if (!block) return null;
              const colors = BLOCK_COLORS[block.color];
              const isFull = course.enrolledStudents >= course.maxStudents;

              return (
                <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{course.title}</div>
                      <div className="text-sm text-muted-foreground">{course.instructor}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", colors.bg)} />
                      <span className="text-sm">{block.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div>{course.schedule.slots.map(s => DAY_NAMES[s.dayOfWeek]).join(", ")}</div>
                      <div className="text-muted-foreground">
                        {formatDate(course.schedule.startDate)} — {formatDate(course.schedule.endDate)}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <span className={cn(isFull && "text-amber-600 font-medium")}>
                        {course.enrolledStudents}
                      </span>
                      <span className="text-muted-foreground"> / {course.maxStudents}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge 
                      variant="secondary"
                      className={cn(
                        course.status === "open" && "bg-emerald-100 text-emerald-700",
                        course.status === "full" && "bg-amber-100 text-amber-700",
                        course.status === "closed" && "bg-slate-100 text-slate-600"
                      )}
                    >
                      {course.status === "open" ? "Открыт" : 
                       course.status === "full" ? "Заполнен" : "Закрыт"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/courses/${course.id}`}>
                        <Button variant="ghost" size="sm">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredCourses.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Курсы не найдены</p>
          </div>
        )}
      </div>
    </main>
  );
}

