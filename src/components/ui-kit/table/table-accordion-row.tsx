"use client";

import React from "react";
import { TableActions, TableActionItem } from "./table-actions";
import { cn } from "@/lib/utils";

interface TableAccordionRowProps {
  title: string;
  info?: string;
  stats?: string | number;
  actions: TableActionItem[];
  className?: string;
  showDot?: boolean;
}

export function TableAccordionRow({
  title,
  info,
  stats,
  actions,
  className,
  showDot = true,
}: TableAccordionRowProps) {
  return (
    <li
      className={cn(
        "px-6 py-3 flex items-center justify-between group hover:bg-default-50 transition-colors",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {showDot && <div className="w-1.5 h-1.5 rounded-full bg-default-300" />}
        <span className="font-medium text-default-700">{title}</span>
        {info && (
          <span className="text-[10px] font-mono text-default-400 capitalize">
            {info}
          </span>
        )}
      </div>
      <div className="flex items-center gap-6">
        {stats !== undefined && (
          <div className="flex items-center gap-1.5 text-default-500">
            <span className="text-[11px] font-semibold">{stats}</span>
          </div>
        )}
        <TableActions actions={actions} />
      </div>
    </li>
  );
}
