// src/entities/course/model/types.ts

/**
 * Course entity from backend
 */
export interface Course {
  id: string;
  code?: string;
  title?: string;
  description: unknown;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

/**
 * Course Offering entity from backend
 */
export interface CourseOffering {
  id: string;
  course_id: string;
  capacity: number;
  enrolled: number;
  enrollment_open: string;
  enrollment_close: string;
  year: number;
  term: "spring" | "fall";
  created_at: string;
}

/**
 * Display course - combined view of Course + CourseOffering for UI
 */
export interface DisplayCourse {
  id: string;
  code?: string;
  title: string;
  description: string;
  isActive: boolean;
  offeringId: string;
  capacity: number;
  enrolled: number;
  enrollmentOpen: Date;
  enrollmentClose: Date;
  year: number;
  term: "spring" | "fall";
  status: CourseStatus;
  availableSeats: number;
}

export type CourseStatus = "open" | "closed" | "full";

