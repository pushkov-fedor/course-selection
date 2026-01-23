// src/features/course-selection/api/index.ts
export { getCourses, getCourseOfferings } from "./courses";
export {
  createEnrollmentRequest,
  getEnrollmentRequest,
  type EnrollmentRequest,
  type EnrollmentRequestItem,
  type CreateEnrollmentRequestPayload,
  type SwitchPayload,
} from "./enrollment";

