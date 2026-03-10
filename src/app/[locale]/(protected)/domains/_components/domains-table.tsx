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
import { Loader2, ExternalLink, Eye, Trash2 } from "lucide-react";
import { TablePagination } from "@/components/ui-kit/table/table-pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Domain } from "@/api/types/domain";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useDomains } from "@/api/hooks/use-domains";
import { useTranslations } from "next-intl";
import { TableActions } from "@/components/ui-kit/table/table-actions";

export function DomainsTable() {
  const { data = [], isLoading } = useDomains();
  console.log("data domains", data);
  const t = useTranslations("DomainsManagement");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

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

  const columns: ColumnDef<Domain>[] = [
    {
      accessorKey: "regionId",
      header: t("table_region").toUpperCase(),
      cell: ({ row }) => (
        <div className="text-default-500 font-medium lowercase">
          {row.original.regionId?.toLowerCase()}
        </div>
      ),
    },
    {
      accessorKey: "domainName",
      header: t("table_domain").toUpperCase(),
      cell: ({ row }) => (
        <Link
          href={`https://${row.original.domainName}`}
          target="_blank"
          className="flex items-center gap-1.5 text-primary hover:underline transition-colors font-medium lowercase"
        >
          {row.original.domainName}
          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
        </Link>
      ),
    },
    {
      accessorKey: "price",
      header: t("table_price").toUpperCase(),
      cell: ({ row }) => (
        <div className="text-default-500">{row.original.price}</div>
      ),
    },
    {
      accessorKey: "renewalPrice",
      header: t("table_renewal_price").toUpperCase(),
      cell: ({ row }) => (
        <div className="text-default-500">{row.original.renewalPrice}</div>
      ),
    },
    {
      accessorKey: "currency",
      header: t("table_currency").toUpperCase(),
      cell: ({ row }) => (
        <div className="text-default-500">
          {row.original.currency?.toUpperCase()}
        </div>
      ),
    },
    {
      accessorKey: "hasMarketplace",
      header: t("table_status").toUpperCase(),
      cell: ({ row }) => {
        const hasMarketplace = row.original.hasMarketplace;
        return (
          <Badge
            color={hasMarketplace ? "success" : "warning"}
            className="capitalize rounded-full px-4 py-1 font-semibold text-[11px]"
          >
            {hasMarketplace ? "Yes" : "No"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "owner",
      header: t("table_owner").toUpperCase(),
      cell: ({ row }) => (
        <div className="text-default-500 whitespace-nowrap">
          {row.original.owner.username}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className="text-end">{t("table_actions").toUpperCase()}</div>
      ),
      cell: ({ row }) => {
        const domainName = row.original.domainName;
        const actions = [
          {
            label: t("action_view"),
            icon: <Eye />,
            onClick: () =>
              router.push(
                `/${locale}/domains/${encodeURIComponent(domainName)}`,
              ),
          },
          {
            label: t("action_delete"),
            icon: <Trash2 />,
            onClick: () => console.log("Delete domain", domainName),
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
                (table.getColumn("domainName")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("domainName")
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
    </Card>
  );
}
