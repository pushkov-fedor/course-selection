// src/types/index.ts

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  department: string;
  credits: number;
  maxStudents: number;
  enrolledStudents: number;
  schedule: CourseSchedule;
  semester: string;
  status: CourseStatus;
  prerequisites?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseSchedule {
  dayOfWeek: DayOfWeek[];
  startTime: string;
  endTime: string;
  room: string;
  building: string;
}

export type DayOfWeek = 
  | "Понедельник" 
  | "Вторник" 
  | "Среда" 
  | "Четверг" 
  | "Пятница" 
  | "Суббота";

export type CourseStatus = 
  | "open"       // Открыт для записи
  | "closed"     // Запись закрыта
  | "full"       // Мест нет
  | "cancelled"; // Отменён

export interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
  status: EnrollmentStatus;
  priority: number;
  motivation?: string;
  documents?: EnrollmentDocument[];
  createdAt: string;
  updatedAt: string;
}

export type EnrollmentStatus =
  | "draft"      // Черновик заявки
  | "pending"    // На рассмотрении
  | "approved"   // Одобрена
  | "rejected"   // Отклонена
  | "waitlist";  // В листе ожидания

export interface EnrollmentDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  studentId: string;
  department: string;
  year: number;
  group: string;
}

export interface Department {
  id: string;
  name: string;
  shortName: string;
}

// Form types
export interface CourseFormData {
  title: string;
  description: string;
  instructor: string;
  department: string;
  credits: number;
  maxStudents: number;
  schedule: {
    dayOfWeek: DayOfWeek[];
    startTime: string;
    endTime: string;
    room: string;
    building: string;
  };
  semester: string;
  prerequisites: string[];
  tags: string[];
}

export interface EnrollmentFormData {
  priority: number;
  motivation: string;
  documents: File[];
}

