"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Eye, Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui-kit/table/data-table";
import { TableActions } from "@/components/ui-kit/table/table-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Site } from "@/api/types/site";
import { useSites } from "@/api/hooks/use-sites";

export function SitesTable() {
  const { data = [], isLoading } = useSites();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const t = useTranslations("SitesManagement");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<Site>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="text-default-500 font-medium">{row.getValue("id")}</div>
      ),
    },
    {
      id: "siteNameCol",
      accessorKey: "marketplaceName",
      header: t("table_site_name").toUpperCase(),
      cell: ({ row }) => (
        <div className="font-bold text-default-900 whitespace-nowrap lowercase">
          {row.original.marketplaceName}
        </div>
      ),
    },
    {
      accessorKey: "ownerName",
      header: t("table_owner").toUpperCase(),
      cell: ({ row }) => {
        const ownerName = row.original.ownerName;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ownerName}`}
              />
              <AvatarFallback>
                {ownerName?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-default-600 font-medium whitespace-nowrap">
              {ownerName}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "domainName",
      header: t("table_domain"),
      cell: ({ row }) => (
        <Link
          href={`https://${row.original.domainName}`}
          target="_blank"
          className="text-default-600 hover:text-primary hover:underline transition-colors whitespace-nowrap lowercase"
          onClick={(e) => e.stopPropagation()}
        >
          {row.original.domainName.toLowerCase()}
        </Link>
      ),
    },
    {
      accessorKey: "folderName",
      header: t("table_images_folder").toUpperCase(),
      cell: ({ row }) => (
        <div className="text-default-500 whitespace-nowrap">
          {row.original.folder}
        </div>
      ),
    },
    {
      accessorKey: "autogeneration",
      header: t("table_autogeneration").toUpperCase(),
      cell: ({ row }) => (
        <div className="text-default-500 whitespace-nowrap">
          <Badge
            color={row.original.autogeneration ? "success" : "warning"}
            className="capitalize rounded-full px-4 py-1 font-semibold text-[11px]"
          >
            {row.original.autogeneration ? "ON" : "OFF"}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: t("table_status").toUpperCase(),
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            color={status === "live" ? "success" : "warning"}
            className="capitalize rounded-full px-4 py-1 font-semibold text-[11px]"
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="text-end">{t("table_actions").toUpperCase()}</div>
      ),
      cell: ({ row }) => {
        const actions = [
          {
            label: t("action_view"),
            icon: <Eye />,
            onClick: () => router.push(`/${locale}/sites/${row.original.id}`),
          },
          {
            label: t("action_delete"),
            icon: <Trash2 />,
            onClick: () => console.log("Delete", row.original.id),
            variant: "destructive" as const,
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
    <DataTable
      table={table}
      totalItems={data.length}
      title={t("table_site_name")}
      filterColumn="status"
      filterPlaceholder={t("filter_placeholder")}
      isLoading={isLoading}
      onRowClick={(row) => router.push(`/${locale}/sites/${row.id}`)}
    />
  );
}
