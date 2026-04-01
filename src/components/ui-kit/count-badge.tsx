"use client";

import { cn } from "@/lib/utils";

interface CountBadgeProps {
  count: number;
  className?: string;
}

export const CountBadge = ({ count, className }: CountBadgeProps) => {
  return (
    <span
      className={cn(
        "bg-primary/10 text-primary text-[12px] px-2 py-0.5 rounded-full font-bold",
        className,
      )}
    >
      {count}
    </span>
  );
};
