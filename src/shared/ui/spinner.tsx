// src/shared/ui/spinner.tsx
import { cn } from "@/shared/lib/cn";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg";
}

function Spinner({ className, size = "default", ...props }: SpinnerProps) {
  const sizeStyles = {
    sm: "size-4 border-2",
    default: "size-6 border-2",
    lg: "size-10 border-3",
  };

  return (
    <div
      className={cn(
        "rounded-full border-primary border-t-transparent animate-spin",
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}

export { Spinner };

