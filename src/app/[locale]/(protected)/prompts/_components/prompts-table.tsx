"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Eye, Edit } from "lucide-react";
import { DataTable, TableActions } from "@/components/ui-kit/table";
import { Prompt } from "@/api/types/prompt";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
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

  return (
    <>
      <DataTable
        table={table}
        totalItems={data.length}
        title={t("title")}
        filterColumn="description"
        filterPlaceholder={t("filter_placeholder")}
        isLoading={isLoading}
        noResultsMessage={t("no_results")}
        onRowClick={
          siteId
            ? (row) =>
                router.push(`/${locale}/sites/${siteId}/prompts/${row.id}`)
            : (row) => router.push(`/${locale}/prompts/${row.id}`)
        }
      />

      <EditPromptDialog
        prompt={selectedPrompt}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        siteId={siteId}
      />
    </>
  );
}
