"use client";

import React from "react";
import { CategorySeoInfo } from "@/api/types/site";
import { TableCell, TableRow } from "@/components/ui/table";
import { CategorySeoDialog } from "./category-seo-dialog";

interface CategorySeoClientRowProps {
  info: CategorySeoInfo;
  translations: {
    details: string;
    field_seo_title: string;
    field_h1: string;
    field_description: string;
    field_text: string;
  };
}

export function CategorySeoClientRow({
  info,
  translations: t,
}: CategorySeoClientRowProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow
        className="hover:bg-default-50 transition-colors cursor-pointer"
        onDoubleClick={() => setOpen(true)}
      >
        <TableCell className="px-6 py-4 font-semibold text-default-900 border-b border-default-50 w-[10%]">
          {info.region || "Default"}
        </TableCell>
        <TableCell className="px-6 py-4 text-sm text-default-700 border-b border-default-50 overflow-hidden text-ellipsis whitespace-nowrap w-[15%]">
          {info.seoTitle || "—"}
        </TableCell>
        <TableCell className="px-6 py-4 text-sm text-default-700 border-b border-default-50 overflow-hidden text-ellipsis whitespace-nowrap w-[15%]">
          {info.h1 || "—"}
        </TableCell>
        <TableCell className="px-6 py-4 border-b border-default-50 w-[30%]">
          <p className="text-xs text-default-600 line-clamp-2">
            {info.seoDescription || "—"}
          </p>
        </TableCell>
        <TableCell className="px-6 py-4 border-b border-default-50 w-[30%]">
          <p className="text-xs text-default-600 line-clamp-2">
            {info.text || "—"}
          </p>
        </TableCell>
      </TableRow>

      <CategorySeoDialog
        open={open}
        onOpenChange={setOpen}
        info={info}
        translations={t}
      />
    </>
  );
}
