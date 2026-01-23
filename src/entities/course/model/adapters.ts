// src/entities/course/model/adapters.ts

import type { Course, CourseOffering, DisplayCourse, CourseStatus } from "./types";

/**
 * Calculate course status based on offering data
 */
export function calculateCourseStatus(
  offering: CourseOffering,
  now: Date = new Date()
): CourseStatus {
  if (offering.enrolled >= offering.capacity) {
    return "full";
  }

  const openDate = new Date(offering.enrollment_open);
  const closeDate = new Date(offering.enrollment_close);

  if (now < openDate || now > closeDate) {
    return "closed";
  }

  return "open";
}

/**
 * Convert backend description (jsonb) to string
 */
export function parseDescription(description: unknown): string {
  if (typeof description === "string") {
    return description;
  }

  if (typeof description === "object" && description !== null) {
    const desc = description as Record<string, unknown>;
    if (typeof desc.description === "string") {
      return desc.description;
    }
    if (typeof desc.text === "string") {
      return desc.text;
    }
    return "";
  }

  return "";
}

/**
 * Merge Course and CourseOffering into DisplayCourse
 */
export function mergeCourseWithOffering(
  course: Course,
  offering: CourseOffering
): DisplayCourse {
  const enrollmentOpen = new Date(offering.enrollment_open);
  const enrollmentClose = new Date(offering.enrollment_close);
  const status = calculateCourseStatus(offering);

  return {
    id: course.id,
    code: course.code,
    title: course.title || "Без названия",
    description: parseDescription(course.description),
    isActive: course.is_active,
    offeringId: offering.id,
    capacity: offering.capacity,
    enrolled: offering.enrolled,
    enrollmentOpen,
    enrollmentClose,
    year: offering.year,
    term: offering.term,
    status,
    availableSeats: offering.capacity - offering.enrolled,
  };
}

/**
 * Merge multiple courses with their offerings
 */
export function mergeCoursesWithOfferings(
  courses: Course[],
  offerings: CourseOffering[]
): DisplayCourse[] {
  const courseMap = new Map(courses.map((c) => [c.id, c]));

  return offerings
    .map((offering) => {
      const course = courseMap.get(offering.course_id);
      if (!course) {
        console.warn(`Course not found for offering ${offering.id}`);
        return null;
      }
      return mergeCourseWithOffering(course, offering);
    })
    .filter((c): c is DisplayCourse => c !== null);
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format term to readable string
 */
export function formatTerm(term: "spring" | "fall"): string {
  return term === "spring" ? "Весна" : "Осень";
}

/**
 * Get status label in Russian
 */
export function getStatusLabel(status: CourseStatus): string {
  switch (status) {
    case "open":
      return "Открыт";
    case "closed":
      return "Закрыт";
    case "full":
      return "Заполнен";
  }
}

/**
 * Get status badge variant
 */
export function getStatusVariant(
  status: CourseStatus
): "success" | "muted" | "destructive" {
  switch (status) {
    case "open":
      return "success";
    case "closed":
      return "muted";
    case "full":
      return "destructive";
  }
}

/**
 * Pluralize Russian word for courses
 */
export function pluralizeCourses(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) {
    return "курс";
  }
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return "курса";
  }
  return "курсов";
}

/**
 * Pluralize Russian word for seats
 */
export function pluralizeSeats(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) {
    return "место";
  }
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return "места";
  }
  return "мест";
}

