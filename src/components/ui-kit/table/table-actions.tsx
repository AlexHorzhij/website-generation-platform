"use client";

import * as React from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface TableActionItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive";
}

interface TableActionsProps {
  actions: TableActionItem[];
  className?: string;
  align?: "start" | "center" | "end";
}

export function TableActions({
  actions,
  className,
  align = "end",
}: TableActionsProps) {
  return (
    <div className={cn("flex justify-end", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full hover:bg-default-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4 text-default-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} className="p-1 min-w-[140px]">
          {actions.map((action, index) => (
            <DropdownMenuItem
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                action.onClick();
              }}
              className={cn(
                "cursor-pointer flex items-center gap-2 px-3 py-2 text-sm transition-colors",
                action.variant === "destructive"
                  ? "text-destructive focus:text-destructive focus:bg-destructive/10"
                  : "text-default-700 font-medium whitespace-nowrap",
              )}
            >
              {action.icon && (
                <span className={cn("flex-none")}>
                  {React.cloneElement(
                    action.icon as React.ReactElement<{ className?: string }>,
                    {
                      className: "w-3.5 h-3.5",
                    },
                  )}
                </span>
              )}
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
