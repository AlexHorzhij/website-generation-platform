"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";

export const ActionBtn = ({
  text,
  onClick,
  href,
  icon = "heroicons:plus",
}: {
  text: string;
  onClick?: () => void;
  href?: string;
  icon?: string;
}) => {
  const content = (
    <>
      <Icon icon={icon} className="w-3.5 h-3.5 mr-2" />
      {text}
    </>
  );

  if (href) {
    return (
      <Button size="sm" asChild className="h-8">
        <Link href={href}>{content}</Link>
      </Button>
    );
  }

  return (
    <Button size="sm" onClick={onClick} className="h-8">
      {content}
    </Button>
  );
};
