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
import {
  MoreVertical,
  Eye,
  Trash2,
  ExternalLink,
  Search,
  Loader2,
} from "lucide-react";
import { TablePagination } from "@/components/ui-kit/table/table-pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Site } from "@/api/types/site";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { TableActions } from "@/components/ui-kit/table/table-actions";

import { useSites } from "@/api/hooks/use-sites";
import { useTranslations } from "next-intl";

interface SitesTableProps {
  translations: {
    site_name: string;
    domain: string;
    folder: string;
    region: string;
    owner: string;
    status: string;
    actions: string;
    action_view: string;
    action_delete: string;
    filter_placeholder: string;
    items_selected: string;
  };
}

export function SitesTable() {
  const { data = [], isLoading } = useSites();
  console.log("data SITES", data);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const t = useTranslations("SitesManagement");

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
  const translations = {
    site_name: t("table_site_name"),
    domain: t("table_domain"),
    folder: t("table_images_folder"),
    region: t("table_region"),
    owner: t("table_owner"),
    status: t("table_status"),
    actions: t("table_actions"),
    action_view: t("action_view"),
    action_delete: t("action_delete"),
    filter_placeholder: t("filter_placeholder"),
    items_selected: t("items_selected"),
  };
  const columns: ColumnDef<Site>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          color="primary"
          className="translate-y-[2px] bg-default-100 border-default-200"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          color="primary"
          className="translate-y-[2px] bg-default-100 border-default-200"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
      header: translations.site_name.toUpperCase(),
      cell: ({ row }) => (
        <div className="font-bold text-default-900 whitespace-nowrap lowercase">
          {row.original.marketplaceName}
        </div>
      ),
    },
    {
      accessorKey: "ownerName",
      header: translations.owner.toUpperCase(),
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
      header: translations.domain,
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
      header: translations.folder.toUpperCase(),
      cell: ({ row }) => (
        <div className="text-default-500 whitespace-nowrap">
          {row.original.folder}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: translations.status.toUpperCase(),
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
        <div className="text-end">{translations.actions.toUpperCase()}</div>
      ),
      cell: ({ row }) => {
        const actions = [
          {
            label: translations.action_view,
            icon: <Eye />,
            onClick: () => router.push(`/${locale}/sites/${row.original.id}`),
          },
          {
            label: translations.action_delete,
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

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  return (
    <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-slate-900">
      <CardHeader className="flex flex-row items-center justify-between py-6 px-6 bg-white dark:bg-slate-900">
        <CardTitle className="text-xl font-bold text-default-900">
          {translations.site_name}
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              placeholder={translations.filter_placeholder}
              value={
                (table.getColumn("status")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("status")?.setFilterValue(event.target.value)
              }
              className="w-[200px] h-10 bg-white dark:bg-slate-800 border-default-200 text-sm focus:ring-primary/20"
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
                    className="h-24 text-center"
                  >
                    No results.
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
    </Card>
  );
}
