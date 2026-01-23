// src/features/course-selection/ui/empty-state.tsx
import { BookX } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-16 animate-fade-in">
      <BookX className="size-16 mx-auto text-muted-foreground/30 mb-4" />
      <h3 className="text-lg font-medium text-muted-foreground mb-2">
        Курсы не найдены
      </h3>
      <p className="text-sm text-muted-foreground">
        В данный момент нет доступных курсов для записи
      </p>
    </div>
  );
}

