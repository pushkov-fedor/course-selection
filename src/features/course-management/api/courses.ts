// src/features/course-management/api/courses.ts

import { get, post, patch, del, buildQueryString } from "@/shared/api";
import type { Course, CourseOffering } from "@/entities/course";

export interface CreateCourseDTO {
  code?: string;
  title?: string;
  description?: string;
  is_active: boolean;
}

export interface UpdateCourseDTO {
  id: string;
  code?: string;
  title?: string;
  description?: string;
  is_active?: boolean;
}

export async function getCourses(params?: {
  limit?: number;
  offset?: number;
  is_active?: boolean;
}): Promise<Course[]> {
  const query = buildQueryString(params || {});
  return get<Course[]>(`/course${query}`);
}

export async function getCourse(id: string): Promise<Course> {
  return get<Course>(`/course/${id}`);
}

export async function createCourse(data: CreateCourseDTO): Promise<Course> {
  return post<Course>("/course", data);
}

export async function updateCourse(id: string, data: UpdateCourseDTO): Promise<Course> {
  return patch<Course>(`/course/${id}`, data);
}

export async function deleteCourse(id: string): Promise<void> {
  return del<void>(`/course/${id}`);
}

export async function getCourseOfferings(params?: {
  limit?: number;
  offset?: number;
}): Promise<CourseOffering[]> {
  const query = buildQueryString(params || {});
  return get<CourseOffering[]>(`/course-offering${query}`);
}

export async function getCourseOffering(id: string): Promise<CourseOffering> {
  return get<CourseOffering>(`/course-offering/${id}`);
}

export interface CreateCourseOfferingDTO {
  course_id: string;
  capacity: number;
  year: number;
  term: "spring" | "fall";
  enrollment_open: string;
  enrollment_close: string;
}

export interface UpdateCourseOfferingDTO {
  capacity?: number;
  year?: number;
  term?: "spring" | "fall";
  enrollment_open?: string;
  enrollment_close?: string;
}

export async function createCourseOffering(
  data: CreateCourseOfferingDTO
): Promise<CourseOffering> {
  return post<CourseOffering>("/course-offering", data);
}

export async function updateCourseOffering(
  id: string,
  data: UpdateCourseOfferingDTO
): Promise<CourseOffering> {
  return patch<CourseOffering>(`/course-offering/${id}`, data);
}

export async function deleteCourseOffering(id: string): Promise<void> {
  return del<void>(`/course-offering/${id}`);
}

