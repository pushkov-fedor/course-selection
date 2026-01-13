// src/app/admin/courses/[id]/page.tsx
import { mockCourses } from "@/lib/mock-data";
import { EditCoursePageClient } from "./EditCoursePageClient";

export function generateStaticParams() {
  return mockCourses.map((course) => ({
    id: course.id,
  }));
}

interface EditCoursePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params;
  return <EditCoursePageClient courseId={id} />;
}

