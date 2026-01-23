// src/shared/ui/skeleton.tsx
import { cn } from "@/shared/lib/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("rounded-md bg-muted skeleton", className)}
      {...props}
    />
  );
}

export { Skeleton };

