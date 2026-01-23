// src/features/course-selection/ui/error-state.tsx
"use client";

import { Button } from "@/shared/ui";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-5 animate-fade-in">
      <div className="flex items-start gap-4">
        <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-destructive mb-1">Ошибка загрузки</h3>
          <p className="text-sm text-muted-foreground mb-3">{message}</p>
          <Button onClick={onRetry} variant="outline" size="sm">
            Попробовать снова
          </Button>
        </div>
      </div>
    </div>
  );
}

