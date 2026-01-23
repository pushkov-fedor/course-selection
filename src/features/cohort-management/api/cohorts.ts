// src/features/cohort-management/api/cohorts.ts

import { get, post, patch, del, buildQueryString } from "@/shared/api";

export interface Cohort {
  id: string;
  name: string;
  admission_year: number;
  graduation_year: number;
}

export interface CohortSemester {
  id: string;
  cohort_id: string;
  number: number;
  term: "spring" | "fall";
  enrollment_open: string;
  enrollment_close: string;
  created_at: string;
}

export interface CreateCohortDTO {
  name: string;
  admission_year: number;
  graduation_year: number;
}

export interface UpdateCohortDTO {
  name?: string;
  admission_year?: number;
  graduation_year?: number;
}

export interface CreateCohortSemesterDTO {
  cohort_id: string;
  number: number;
  term: "spring" | "fall";
  enrollment_open: string;
  enrollment_close: string;
}

export interface UpdateCohortSemesterDTO {
  number?: number;
  term?: "spring" | "fall";
  enrollment_open?: string;
  enrollment_close?: string;
}

// Cohort API
export async function getCohorts(params?: {
  limit?: number;
  offset?: number;
}): Promise<Cohort[]> {
  // Workaround: always provide limit and offset to avoid backend nil pointer dereference
  const queryParams = {
    limit: params?.limit ?? 100,
    offset: params?.offset ?? 0,
    ...params,
  };
  const query = buildQueryString(queryParams);
  return get<Cohort[]>(`/cohort${query}`);
}

export async function getCohort(id: string): Promise<Cohort> {
  return get<Cohort>(`/cohort/${id}`);
}

export async function createCohort(data: CreateCohortDTO): Promise<Cohort> {
  return post<Cohort>("/cohort", data);
}

export async function updateCohort(
  id: string,
  data: UpdateCohortDTO
): Promise<Cohort> {
  return patch<Cohort>(`/cohort/${id}`, data);
}

export async function deleteCohort(id: string): Promise<void> {
  return del<void>(`/cohort/${id}`);
}

// Cohort Semester API
export async function getCohortSemesters(params?: {
  limit?: number;
  offset?: number;
}): Promise<CohortSemester[]> {
  // Workaround: always provide limit and offset to avoid backend nil pointer dereference
  const queryParams = {
    limit: params?.limit ?? 200,
    offset: params?.offset ?? 0,
    ...params,
  };
  const query = buildQueryString(queryParams);
  return get<CohortSemester[]>(`/cohort-semesters${query}`);
}

export async function getCohortSemester(id: string): Promise<CohortSemester> {
  return get<CohortSemester>(`/cohort-semesters/${id}`);
}

export async function createCohortSemester(
  data: CreateCohortSemesterDTO
): Promise<CohortSemester> {
  return post<CohortSemester>("/cohort-semesters", data);
}

export async function updateCohortSemester(
  id: string,
  data: UpdateCohortSemesterDTO
): Promise<CohortSemester> {
  return patch<CohortSemester>(`/cohort-semesters/${id}`, data);
}

export async function deleteCohortSemester(id: string): Promise<void> {
  return del<void>(`/cohort-semesters/${id}`);
}

