"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface GoBackBtnProps {
  collapsed?: boolean;
  text: string;
  link: string;
}

const GoBackBtn = ({ text, link, collapsed }: GoBackBtnProps) => {
  const t = useTranslations("Menu");

  if (collapsed) {
    return (
      <div className="flex justify-center px-2 pt-2 pb-1">
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <Link href={link}>
                  <Icon
                    icon="heroicons-outline:arrow-left"
                    className="w-5 h-5"
                  />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{text}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="mt-1 h-px bg-default-100 w-full" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-2 pb-1">
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-sm font-medium text-default-600 hover:text-default-900 gap-2 px-2"
        asChild
      >
        <Link href={link}>
          <Icon
            icon="heroicons-outline:arrow-left"
            className="w-4 h-4 flex-shrink-0"
          />
          <span className="truncate">{text}</span>
        </Link>
      </Button>
      <div className="mt-2 mb-1 h-px bg-default-100" />
    </div>
  );
};

export default GoBackBtn;
