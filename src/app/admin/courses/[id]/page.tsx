// src/app/admin/courses/[id]/page.tsx
import { CourseEditPage } from "@/features/course-management";

interface EditCoursePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params;
  return <CourseEditPage courseId={id} />;
}
