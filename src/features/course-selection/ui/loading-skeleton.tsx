// src/features/course-selection/ui/loading-skeleton.tsx
import { Card, Skeleton } from "@/shared/ui";

export function CourseGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <div className="p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="size-5 rounded" />
            </div>
            <Skeleton className="h-10 w-full" />
            <div className="flex justify-between items-center pt-3 border-t border-border/50">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <aside className="w-80 shrink-0">
      <div className="sticky top-24 bg-card rounded-xl border shadow-sm overflow-hidden animate-pulse">
        <div className="p-4 border-b bg-muted/30 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="p-4">
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="p-4 border-t bg-muted/30">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </aside>
  );
}

