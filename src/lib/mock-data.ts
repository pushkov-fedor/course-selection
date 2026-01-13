// src/lib/mock-data.ts
import { Course, CourseBlock, DayOfWeek } from "@/types";

export const courseBlocks: CourseBlock[] = [
  {
    id: "block-ml",
    name: "Машинное обучение",
    description: "Выберите один курс по машинному обучению",
    color: "blue",
    required: true,
  },
  {
    id: "block-dev",
    name: "Разработка",
    description: "Курсы по разработке ПО",
    color: "emerald",
    required: true,
  },
  {
    id: "block-math",
    name: "Математика",
    description: "Углублённые курсы по математике",
    color: "violet",
    required: false,
  },
  {
    id: "block-soft",
    name: "Soft Skills",
    description: "Дополнительные навыки",
    color: "amber",
    required: false,
  },
];

export const mockCourses: Course[] = [
  // Блок ML
  {
    id: "ml-basics",
    title: "Основы машинного обучения",
    shortTitle: "ML Basics",
    description: "Введение в ML: регрессия, классификация, кластеризация",
    instructor: "Иванов А.С.",
    blockId: "block-ml",
    credits: 4,
    maxStudents: 30,
    enrolledStudents: 25,
    schedule: {
      startDate: "2026-02-10",
      endDate: "2026-04-20",
      slots: [
        { dayOfWeek: 1 as DayOfWeek, startTime: "10:00", endTime: "11:30", room: "305" },
        { dayOfWeek: 3 as DayOfWeek, startTime: "10:00", endTime: "11:30", room: "305" },
      ],
    },
    semester: "Весна 2026",
    status: "open",
  },
  {
    id: "ml-deep",
    title: "Глубокое обучение",
    shortTitle: "Deep Learning",
    description: "Нейронные сети, CNN, RNN, трансформеры",
    instructor: "Иванов А.С.",
    blockId: "block-ml",
    credits: 4,
    maxStudents: 25,
    enrolledStudents: 25,
    schedule: {
      startDate: "2026-02-10",
      endDate: "2026-05-15",
      slots: [
        { dayOfWeek: 2 as DayOfWeek, startTime: "14:00", endTime: "15:30", room: "401" },
        { dayOfWeek: 4 as DayOfWeek, startTime: "14:00", endTime: "15:30", room: "401" },
      ],
    },
    semester: "Весна 2026",
    status: "full",
  },
  {
    id: "ml-nlp",
    title: "Обработка естественного языка",
    shortTitle: "NLP",
    description: "NLP, текстовая аналитика, LLM",
    instructor: "Петрова М.К.",
    blockId: "block-ml",
    credits: 3,
    maxStudents: 20,
    enrolledStudents: 12,
    schedule: {
      startDate: "2026-03-01",
      endDate: "2026-05-01",
      slots: [
        { dayOfWeek: 5 as DayOfWeek, startTime: "09:00", endTime: "11:30", room: "210" },
      ],
    },
    semester: "Весна 2026",
    status: "open",
  },
  
  // Блок Dev
  {
    id: "dev-backend",
    title: "Backend-разработка",
    shortTitle: "Backend",
    description: "Go, микросервисы, базы данных",
    instructor: "Сидоров П.В.",
    blockId: "block-dev",
    credits: 4,
    maxStudents: 25,
    enrolledStudents: 18,
    schedule: {
      startDate: "2026-02-10",
      endDate: "2026-05-20",
      slots: [
        { dayOfWeek: 1 as DayOfWeek, startTime: "14:00", endTime: "15:30", room: "502" },
        { dayOfWeek: 4 as DayOfWeek, startTime: "14:00", endTime: "15:30", room: "502" },
      ],
    },
    semester: "Весна 2026",
    status: "open",
  },
  {
    id: "dev-frontend",
    title: "Frontend-разработка",
    shortTitle: "Frontend",
    description: "React, TypeScript, Next.js",
    instructor: "Козлова А.И.",
    blockId: "block-dev",
    credits: 4,
    maxStudents: 25,
    enrolledStudents: 22,
    schedule: {
      startDate: "2026-02-15",
      endDate: "2026-05-10",
      slots: [
        { dayOfWeek: 2 as DayOfWeek, startTime: "10:00", endTime: "11:30", room: "305" },
        { dayOfWeek: 5 as DayOfWeek, startTime: "10:00", endTime: "11:30", room: "305" },
      ],
    },
    semester: "Весна 2026",
    status: "open",
  },
  {
    id: "dev-mobile",
    title: "Мобильная разработка",
    shortTitle: "Mobile",
    description: "Flutter, React Native, кроссплатформенность",
    instructor: "Новиков Д.С.",
    blockId: "block-dev",
    credits: 3,
    maxStudents: 20,
    enrolledStudents: 15,
    schedule: {
      startDate: "2026-03-01",
      endDate: "2026-04-30",
      slots: [
        { dayOfWeek: 3 as DayOfWeek, startTime: "16:00", endTime: "18:30", room: "401" },
      ],
    },
    semester: "Весна 2026",
    status: "open",
  },
  
  // Блок Math
  {
    id: "math-stats",
    title: "Математическая статистика",
    shortTitle: "Статистика",
    description: "Продвинутый курс статистики",
    instructor: "Белова Н.К.",
    blockId: "block-math",
    credits: 3,
    maxStudents: 30,
    enrolledStudents: 20,
    schedule: {
      startDate: "2026-02-10",
      endDate: "2026-04-10",
      slots: [
        { dayOfWeek: 1 as DayOfWeek, startTime: "09:00", endTime: "10:30", room: "210" },
        { dayOfWeek: 3 as DayOfWeek, startTime: "09:00", endTime: "10:30", room: "210" },
      ],
    },
    semester: "Весна 2026",
    status: "open",
  },
  {
    id: "math-optim",
    title: "Методы оптимизации",
    shortTitle: "Оптимизация",
    description: "Выпуклая оптимизация, градиентные методы",
    instructor: "Громов П.Л.",
    blockId: "block-math",
    credits: 3,
    maxStudents: 25,
    enrolledStudents: 10,
    schedule: {
      startDate: "2026-02-20",
      endDate: "2026-05-01",
      slots: [
        { dayOfWeek: 4 as DayOfWeek, startTime: "10:00", endTime: "12:30", room: "110" },
      ],
    },
    semester: "Весна 2026",
    status: "open",
  },
  
  // Блок Soft Skills
  {
    id: "soft-present",
    title: "Публичные выступления",
    shortTitle: "Презентации",
    description: "Навыки презентации и коммуникации",
    instructor: "Морозова А.В.",
    blockId: "block-soft",
    credits: 2,
    maxStudents: 15,
    enrolledStudents: 10,
    schedule: {
      startDate: "2026-02-10",
      endDate: "2026-03-30",
      slots: [
        { dayOfWeek: 6 as DayOfWeek, startTime: "10:00", endTime: "12:30", room: "Конференц-зал" },
      ],
    },
    semester: "Весна 2026",
    status: "open",
  },
  {
    id: "soft-pm",
    title: "Основы управления проектами",
    shortTitle: "PM",
    description: "Agile, Scrum, планирование",
    instructor: "Кузнецов И.М.",
    blockId: "block-soft",
    credits: 2,
    maxStudents: 20,
    enrolledStudents: 18,
    schedule: {
      startDate: "2026-03-15",
      endDate: "2026-05-15",
      slots: [
        { dayOfWeek: 6 as DayOfWeek, startTime: "14:00", endTime: "16:30", room: "305" },
      ],
    },
    semester: "Весна 2026",
    status: "open",
  },
];

// Helpers
export function getCoursesByBlock(blockId: string): Course[] {
  return mockCourses.filter((course) => course.blockId === blockId);
}

export function getBlockById(blockId: string): CourseBlock | undefined {
  return courseBlocks.find((block) => block.id === blockId);
}

export function getCourseById(courseId: string): Course | undefined {
  return mockCourses.find((course) => course.id === courseId);
}

// Получить даты семестра для timeline
export function getSemesterDateRange(): { start: Date; end: Date } {
  return {
    start: new Date("2026-02-01"),
    end: new Date("2026-06-01"),
  };
}

// Получить все недели семестра
export function getSemesterWeeks(): Date[] {
  const { start, end } = getSemesterDateRange();
  const weeks: Date[] = [];
  const current = new Date(start);
  
  // Найти первый понедельник
  while (current.getDay() !== 1) {
    current.setDate(current.getDate() + 1);
  }
  
  while (current <= end) {
    weeks.push(new Date(current));
    current.setDate(current.getDate() + 7);
  }
  
  return weeks;
}
