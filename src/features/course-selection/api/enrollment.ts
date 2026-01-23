// src/features/course-selection/api/enrollment.ts

import { get, post, buildQueryString } from "@/shared/api";

export interface EnrollmentRequestItem {
  ID: string;
  CourseOfferingID: string;
  StudentID: string;
  EnrollmentRequestID: string;
  Type: "main" | "reserve" | "switch";
  Status: "new" | "success" | "cancelled" | "error";
  CommentOnStatus?: string | null;
  CreatedAt: string;
}

export interface SwitchPayload {
  from_course_offering_id: string;
  to_course_offering_id: string;
}

export interface EnrollmentRequest {
  id: string;
  student_id: string;
  cohort_semester_id: string;
  courses: EnrollmentRequestItem[];
  status: "new" | "partial" | "completed" | "failed";
  error?: string;
  type: "new" | "switch";
  switch?: SwitchPayload[];
  created_at: string;
}

export interface CreateEnrollmentRequestPayload {
  student_id: string;
  cohort_semester_id: string;
  courses: Array<{
    course_offering_id: string;
    type: "main" | "reserve";
  }>;
  type: "new" | "switch";
  switch?: SwitchPayload[];
}

export async function createEnrollmentRequest(
  payload: CreateEnrollmentRequestPayload
): Promise<{ id: string }> {
  return post<{ id: string }>("/enrollment-request", payload);
}

export async function getEnrollmentRequest(
  studentId: string,
  cohortSemesterId: string
): Promise<EnrollmentRequest | null> {
  const query = buildQueryString({
    student_id: studentId,
    cohort_semester_id: cohortSemesterId,
  });

  try {
    return await get<EnrollmentRequest>(`/enrollment-request${query}`);
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    if (err?.status === 500 && err?.message?.includes("no rows in result set")) {
      return null;
    }
    throw error;
  }
}

