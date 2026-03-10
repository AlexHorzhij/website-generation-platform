"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2, Eye, Edit } from "lucide-react";
import { TablePagination } from "@/components/ui-kit/table/table-pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Prompt } from "@/api/types/prompt";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { TableActions } from "@/components/ui-kit/table/table-actions";
import { EditPromptDialog } from "./edit-prompt-dialog";
import { Badge } from "@/components/ui/badge";
import { usePrompts, useSitePrompts } from "@/api/hooks/use-prompts";

interface PromptsTableProps {
  siteId?: number;
}

export function PromptsTable({ siteId }: PromptsTableProps) {
  const { data: allPrompts = [], isLoading: isAllLoading } = usePrompts();
  const { data: sitePrompts = [], isLoading: isSiteLoading } = useSitePrompts(
    siteId as number,
  );
  console.log("sitePrompts", sitePrompts);
  // const [data: sitePrompts] = useSitePrompts(siteId as number);

  const data = siteId ? sitePrompts : allPrompts;
  const isLoading = siteId ? isSiteLoading : isAllLoading;

  const t = useTranslations("PromptsManagement");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedPrompt, setSelectedPrompt] = React.useState<Prompt | null>(
    null,
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<Prompt>[] = [
    {
      accessorKey: "id",
      header: t("table_id").toUpperCase(),
      cell: ({ row }) => (
        <div className="text-default-500 font-medium">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "appointment",
      header: t("table_appointment").toUpperCase(),
      cell: ({ row }) => (
        <div className="text-default-900 font-medium">
          {row.getValue("appointment")}
        </div>
      ),
    },
    ...(siteId
      ? [
          {
            id: "status",
            header: t("table_status").toUpperCase(),
            cell: ({ row }: { row: any }) => (
              <div className="flex gap-1">
                {row.original.default && (
                  <Badge color="info" className="text-[10px] px-2">
                    Default
                  </Badge>
                )}
                {row.original.customized && (
                  <Badge color="warning" className="text-[10px] px-2">
                    Customized
                  </Badge>
                )}
              </div>
            ),
          },
        ]
      : []),
    {
      accessorKey: "description",
      header: t("table_description").toUpperCase(),
      cell: ({ row }) => (
        <div className="text-default-500 max-w-[300px] truncate">
          {row.getValue("description")}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className="text-end">{t("table_actions").toUpperCase()}</div>
      ),
      cell: ({ row }) => {
        const id = row.original.id;
        const actions = [
          {
            label: t("action_view"),
            icon: <Eye className="w-4 h-4" />,
            onClick: () => {
              if (siteId) {
                router.push(`/${locale}/sites/${siteId}/prompts/${id}`);
              } else {
                router.push(`/${locale}/prompts/${id}`);
              }
            },
          },
          {
            label: t("action_edit"),
            icon: <Edit className="w-4 h-4" />,
            onClick: () => {
              setSelectedPrompt(row.original);
              setIsEditDialogOpen(true);
            },
          },
        ];
        return <TableActions actions={actions} />;
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="animate-spin w-6 h-6 text-primary" />
      </div>
    );
  }

  return (
    <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-slate-900">
      <CardHeader className="flex flex-row items-center justify-between py-6 px-6 bg-white dark:bg-slate-900">
        <CardTitle className="text-xl font-bold text-default-900">
          {t("title")}
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              placeholder={t("filter_placeholder")}
              value={
                (table.getColumn("description")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("description")
                  ?.setFilterValue(event.target.value)
              }
              className="w-[220px] h-10 bg-white dark:bg-slate-800 border-default-200 text-sm focus:ring-primary/20"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white dark:bg-slate-900 border-y border-default-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent border-none"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-14 px-6 text-default-900 font-bold text-[11px] uppercase tracking-wider bg-white dark:bg-slate-900"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="h-14 border-b border-default-50 hover:bg-default-50/50 transition-colors"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-6 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-default-400"
                  >
                    {t("no_results")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="border-t border-default-100">
          <TablePagination table={table} totalItems={data.length} />
        </div>
      </CardContent>

      <EditPromptDialog
        prompt={selectedPrompt}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        siteId={siteId}
      />
    </Card>
  );
}
