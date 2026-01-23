// src/app/admin/layout.tsx
import { AdminHeader } from "@/features/course-management";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />
      {children}
    </div>
  );
}
