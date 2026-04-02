"use client";

import { flexRender, Table as TanstackTable } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TablePagination } from "./table-pagination";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
  table: TanstackTable<TData>;
  totalItems: number;
  title?: string;
  filterColumn?: string;
  filterPlaceholder?: string;
  isLoading?: boolean;
  onRowClick?: (row: TData) => void;
  onRowDoubleClick?: (row: TData) => void;
  noResultsMessage?: string;
  headerActions?: React.ReactNode;
}

export function DataTable<TData>({
  table,
  totalItems,
  title,
  filterColumn,
  filterPlaceholder,
  isLoading,
  onRowClick,
  onRowDoubleClick,
  noResultsMessage = "No results.",
  headerActions,
}: DataTableProps<TData>) {
  return (
    <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-slate-900 mt-2">
      {(title || filterColumn || headerActions) && (
        <CardHeader className="flex flex-row items-center justify-between py-6 px-6 bg-white dark:bg-slate-900 border-b border-default-100">
          <CardTitle className="text-xl font-bold text-default-900">
            {title}
          </CardTitle>
          <div className="flex items-center gap-4">
            {filterColumn && (
              <div className="relative">
                <Input
                  placeholder={filterPlaceholder || "Filter..."}
                  value={
                    (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table.getColumn(filterColumn)?.setFilterValue(event.target.value)
                  }
                  className="w-[220px] h-10 bg-white dark:bg-slate-800 border-default-200 text-sm focus:ring-primary/20"
                />
              </div>
            )}
            {headerActions}
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="border-separate border-spacing-0">
            <TableHeader className="bg-white dark:bg-slate-900 border-b border-default-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent border-none"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-14 px-6 text-default-900 font-bold text-[11px] uppercase tracking-wider bg-white dark:bg-slate-900"
                      style={{ width: header.getSize() !== 150 ? `${header.getSize()}px` : undefined }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={table.getVisibleFlatColumns().length}
                    className="h-24 text-center"
                  >
                    <div className="flex items-center justify-center">
                      <Loader2 className="animate-spin w-6 h-6 text-primary" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className={cn(
                      "h-14 border-b border-default-50 hover:bg-default-100/70 relative hover:z-10 hover:ring-1 hover:ring-inset hover:ring-default-200 transition-all",
                      (onRowClick || onRowDoubleClick) && "cursor-pointer"
                    )}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                    onDoubleClick={onRowDoubleClick ? () => onRowDoubleClick(row.original) : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id} 
                        className="px-6 py-3"
                        style={{ width: cell.column.getSize() !== 150 ? `${cell.column.getSize()}px` : undefined }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getVisibleFlatColumns().length}
                    className="h-24 text-center text-default-400"
                  >
                    {noResultsMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="border-t border-default-100 bg-white dark:bg-slate-900">
          <TablePagination table={table} totalItems={totalItems} />
        </div>
      </CardContent>
    </Card>
  );
}
