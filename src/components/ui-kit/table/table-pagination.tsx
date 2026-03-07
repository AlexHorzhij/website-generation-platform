"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { useTranslations } from "next-intl";

interface TablePaginationProps<TData> {
  table: Table<TData>;
  totalItems: number;
  className?: string;
}

export function TablePagination<TData>({
  table,
  totalItems,
  className,
}: TablePaginationProps<TData>) {
  const t = useTranslations("Table");
  const labels = {
    showing: t("showing"),
    of: t("of"),
    results: t("results"),
    rowsPerPage: t("rows_per_page"),
    selected: t("selected"),
  };
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div
      className={cn("flex items-center justify-between px-6 py-4", className)}
    >
      <div className="flex items-center gap-6">
        {selectedCount > 0 ? (
          <div className="text-sm text-default-500 font-medium whitespace-nowrap">
            {selectedCount} {labels.selected}
          </div>
        ) : (
          <div className="text-sm text-default-500 font-medium whitespace-nowrap">
            {labels.showing} {table.getRowModel().rows.length} {labels.of}{" "}
            {totalItems} {labels.results}
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-default-500 whitespace-nowrap">
            {labels.rowsPerPage}
          </span>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-[70px] h-8 text-[11px] font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem
                  key={size}
                  value={size.toString()}
                  className="text-xs"
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Pagination className="w-auto mx-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                table.previousPage();
              }}
              data-disabled={!table.getCanPreviousPage()}
              className={
                !table.getCanPreviousPage()
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>

          {Array.from({ length: pageCount }, (_, i) => {
            const isPageActive = pageIndex === i;
            // Show current page, first and last pages, and pages around current
            if (
              i === 0 ||
              i === pageCount - 1 ||
              Math.abs(pageIndex - i) <= 1
            ) {
              return (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={isPageActive}
                    onClick={(e) => {
                      e.preventDefault();
                      table.setPageIndex(i);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            // Show ellipsis
            if (Math.abs(pageIndex - i) === 2) {
              return (
                <PaginationItem key={i}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return null;
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                table.nextPage();
              }}
              data-disabled={!table.getCanNextPage()}
              className={
                !table.getCanNextPage() ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
