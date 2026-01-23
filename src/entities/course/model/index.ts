// src/entities/course/model/index.ts
export type {
  Course,
  CourseOffering,
  DisplayCourse,
  CourseStatus,
} from "./types";

export {
  calculateCourseStatus,
  parseDescription,
  mergeCourseWithOffering,
  mergeCoursesWithOfferings,
  formatDate,
  formatTerm,
  getStatusLabel,
  getStatusVariant,
  pluralizeCourses,
  pluralizeSeats,
} from "./adapters";

