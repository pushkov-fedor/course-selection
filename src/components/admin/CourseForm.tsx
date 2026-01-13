// src/components/admin/CourseForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Course, CourseBlock, DayOfWeek, DAY_NAMES_FULL, BLOCK_COLORS } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface CourseFormProps {
  course?: Course;
  blocks: CourseBlock[];
  onSubmit: (data: CourseFormData) => Promise<void>;
}

export interface CourseFormData {
  title: string;
  shortTitle: string;
  description: string;
  instructor: string;
  blockId: string;
  credits: number;
  maxStudents: number;
  startDate: string;
  endDate: string;
  slots: Array<{
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
  }>;
}

const DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6];

export function CourseForm({ course, blocks, onSubmit }: CourseFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState(course?.title || "");
  const [shortTitle, setShortTitle] = useState(course?.shortTitle || "");
  const [description, setDescription] = useState(course?.description || "");
  const [instructor, setInstructor] = useState(course?.instructor || "");
  const [blockId, setBlockId] = useState(course?.blockId || "");
  const [credits, setCredits] = useState(course?.credits?.toString() || "3");
  const [maxStudents, setMaxStudents] = useState(course?.maxStudents?.toString() || "25");
  const [startDate, setStartDate] = useState(course?.schedule.startDate || "2026-02-10");
  const [endDate, setEndDate] = useState(course?.schedule.endDate || "2026-05-20");
  const [slots, setSlots] = useState<Array<{ dayOfWeek: DayOfWeek; startTime: string; endTime: string }>>(
    course?.schedule.slots.map(s => ({ dayOfWeek: s.dayOfWeek, startTime: s.startTime, endTime: s.endTime })) || 
    [{ dayOfWeek: 1, startTime: "10:00", endTime: "11:30" }]
  );

  const addSlot = () => {
    setSlots([...slots, { dayOfWeek: 1, startTime: "10:00", endTime: "11:30" }]);
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const updateSlot = (index: number, field: keyof typeof slots[0], value: DayOfWeek | string) => {
    setSlots(slots.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        title,
        shortTitle,
        description,
        instructor,
        blockId,
        credits: parseInt(credits),
        maxStudents: parseInt(maxStudents),
        startDate,
        endDate,
        slots,
      });
      router.push("/admin");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = title && description && instructor && blockId && slots.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-lg border border-border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Основная информация</h2>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-2">
            <label className="text-sm font-medium">Название курса *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Машинное обучение"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Короткое название</label>
            <Input
              value={shortTitle}
              onChange={(e) => setShortTitle(e.target.value)}
              placeholder="ML"
            />
            <p className="text-xs text-muted-foreground">Для отображения в календаре</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Преподаватель *</label>
            <Input
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              placeholder="Иванов А.С."
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
              rows={4}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        </div>
      </div>

      {/* Block & Credits */}
      <div className="bg-white rounded-lg border border-border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Блок и кредиты</h2>
        
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Блок курса *</label>
            <Select value={blockId} onValueChange={setBlockId} required>
              <SelectTrigger>
                <SelectValue placeholder="Выберите блок" />
              </SelectTrigger>
              <SelectContent>
                {blocks.map(block => {
                  const colors = BLOCK_COLORS[block.color];
                  return (
                    <SelectItem key={block.id} value={block.id}>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", colors.bg)} />
                        {block.name}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Кредиты</label>
            <Select value={credits} onValueChange={setCredits}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <SelectItem key={n} value={n.toString()}>{n} кр.</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Макс. студентов</label>
            <Input
              type="number"
              min="5"
              max="200"
              value={maxStudents}
              onChange={(e) => setMaxStudents(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-white rounded-lg border border-border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Расписание</h2>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Дата начала</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Дата окончания</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Занятия *</label>
          
          {slots.map((slot, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
              <Select 
                value={slot.dayOfWeek.toString()} 
                onValueChange={(v) => updateSlot(index, "dayOfWeek", parseInt(v) as DayOfWeek)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map(day => (
                    <SelectItem key={day} value={day.toString()}>
                      {DAY_NAMES_FULL[day]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="time"
                value={slot.startTime}
                onChange={(e) => updateSlot(index, "startTime", e.target.value)}
                className="w-32"
              />

              <span className="text-muted-foreground">—</span>

              <Input
                type="time"
                value={slot.endTime}
                onChange={(e) => updateSlot(index, "endTime", e.target.value)}
                className="w-32"
              />

              {slots.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSlot(index)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              )}
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addSlot} className="gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Добавить занятие
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Отмена
        </Button>
        <Button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Сохранение...
            </>
          ) : course ? "Сохранить изменения" : "Создать курс"}
        </Button>
      </div>
    </form>
  );
}

