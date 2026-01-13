// src/types/index.ts

export interface Course {
  id: string;
  title: string;
  shortTitle?: string;
  description: string;
  instructor: string;
  blockId: string; // К какому блоку относится курс
  credits: number;
  maxStudents: number;
  enrolledStudents: number;
  schedule: CourseSchedule;
  semester: string;
  status: CourseStatus;
  color?: string; // Цвет для отображения на timeline
}

export interface CourseSchedule {
  // Период проведения курса
  startDate: string; // ISO date
  endDate: string;   // ISO date
  // Расписание занятий
  slots: TimeSlot[];
}

export interface TimeSlot {
  dayOfWeek: DayOfWeek;
  startTime: string; // "09:00"
  endTime: string;   // "10:30"
  room: string;
  building?: string;
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Воскресенье, 1 = Понедельник, ...

export const DAY_NAMES: Record<DayOfWeek, string> = {
  0: "Вс",
  1: "Пн",
  2: "Вт",
  3: "Ср",
  4: "Чт",
  5: "Пт",
  6: "Сб",
};

export const DAY_NAMES_FULL: Record<DayOfWeek, string> = {
  0: "Воскресенье",
  1: "Понедельник",
  2: "Вторник",
  3: "Среда",
  4: "Четверг",
  5: "Пятница",
  6: "Суббота",
};

export type CourseStatus = "open" | "closed" | "full";

// Блок курсов — группа, из которой можно выбрать только один курс
export interface CourseBlock {
  id: string;
  name: string;
  description?: string;
  color: BlockColor;
  required: boolean; // Обязательно ли выбрать курс из этого блока
  minCredits?: number;
  maxCredits?: number;
}

export type BlockColor = 
  | "blue" 
  | "emerald" 
  | "amber" 
  | "violet" 
  | "rose" 
  | "cyan";

export const BLOCK_COLORS: Record<BlockColor, { bg: string; text: string; border: string; light: string }> = {
  blue: { bg: "bg-blue-500", text: "text-blue-700", border: "border-blue-300", light: "bg-blue-50" },
  emerald: { bg: "bg-emerald-500", text: "text-emerald-700", border: "border-emerald-300", light: "bg-emerald-50" },
  amber: { bg: "bg-amber-500", text: "text-amber-700", border: "border-amber-300", light: "bg-amber-50" },
  violet: { bg: "bg-violet-500", text: "text-violet-700", border: "border-violet-300", light: "bg-violet-50" },
  rose: { bg: "bg-rose-500", text: "text-rose-700", border: "border-rose-300", light: "bg-rose-50" },
  cyan: { bg: "bg-cyan-500", text: "text-cyan-700", border: "border-cyan-300", light: "bg-cyan-50" },
};

// Выбор студента
export interface Selection {
  blockId: string;
  courseId: string | null;
}

// View mode для отображения
export type ViewMode = "timeline" | "tiles";
