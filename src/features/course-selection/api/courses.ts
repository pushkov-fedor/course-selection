// src/features/course-selection/api/courses.ts

import { get, buildQueryString } from "@/shared/api";
import type { Course, CourseOffering } from "@/entities/course";

export async function getCourses(params?: {
  limit?: number;
  offset?: number;
  is_active?: boolean;
}): Promise<Course[]> {
  const query = buildQueryString(params || {});
  return get<Course[]>(`/course${query}`);
}

export async function getCourseOfferings(params?: {
  limit?: number;
  offset?: number;
}): Promise<CourseOffering[]> {
  const query = buildQueryString(params || {});
  return get<CourseOffering[]>(`/course-offering${query}`);
}

