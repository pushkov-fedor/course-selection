// src/shared/ui/toaster.tsx
"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group bg-white text-foreground shadow-xl rounded-xl border-0 overflow-hidden",
          title: "text-sm font-semibold text-gray-900",
          description: "text-sm text-gray-600",
          success:
            "!border-l-4 !border-l-emerald-500 [&>svg]:!text-emerald-500",
          error:
            "!border-l-4 !border-l-red-500 [&>svg]:!text-red-500",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
        },
      }}
    />
  );
}

