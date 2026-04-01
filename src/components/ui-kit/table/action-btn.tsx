"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const ActionBtn = ({
  text,
  onClick,
  href,
  icon = "heroicons:plus",
  className,
  color,
}: {
  text?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  href?: string;
  icon?: string;
  className?: string;
  color?: "primary" | "secondary" | "success" | "info" | "warning" | "destructive" | "default";
}) => {
  const content = (
    <>
      <Icon icon={icon} className={cn("w-4 h-4", text ? "mr-2" : "")} />
      {text}
    </>
  );

  if (href) {
    return (
      <Button size="sm" asChild className={cn("h-8", className)} color={color}>
        <Link href={href}>{content}</Link>
      </Button>
    );
  }

  return (
    <Button size="sm" onClick={onClick} className={cn("h-8", className)} color={color}>
      {content}
    </Button>
  );
};
