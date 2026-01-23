import { OfferingEditPage } from "@/features/course-management";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditOfferingPage({ params }: PageProps) {
  const { id } = await params;
  return <OfferingEditPage offeringId={id} />;
}

