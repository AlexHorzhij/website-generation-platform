"use client";

import * as React from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Search, Eye, Trash2 } from "lucide-react";
import { TableActions } from "@/components/ui-kit/table/table-actions";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ListingDetailsDialog } from "./listing-details-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Listing } from "@/types/listing";
import { Site } from "@/types/site";
import { useListings, useFolders, siteKeys } from "@/hooks/use-sites";
import { SiteService } from "@/services/site-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { StatisticsBlock } from "@/components/blocks/statistics-block";
import { StatusBlock } from "@/components/blocks/status-block";
import { ActionBlock } from "@/components/blocks/action-block";
import { EditableActionBlock } from "@/components/blocks/editable-action-block";
import { Switch } from "@/components/ui/switch";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { PageLayout } from "../../_components/page-layout";
import { CreateBtn } from "@/components/ui-kit/table/create-btn";

interface ListingsClientProps {
  site: Site;
  translations: {
    title: string;
    table_title: string;
    table_price: string;
    table_category: string;
    table_status: string;
    table_views: string;
    table_date: string;
    stats_total: string;
    stats_autogeneration: string;
    stats_autogen_per_day: string;
    stats_images_folder: string;
    back_to_site: string;
    actions: string;
    action_view: string;
    action_delete: string;
    field_id: string;
    field_title: string;
    field_description: string;
    field_price: string;
    field_status: string;
    field_created: string;
    field_views: string;
    field_username: string;
    field_site: string;
    field_category: string;
    field_region: string;
    field_contact: string;
    field_theme: string;
    field_images: string;
    field_no_images: string;
    details_title: string;
    create_listing: string;
  };
}

export default function ListingsClient({
  site,
  translations: t,
}: ListingsClientProps) {
  const [isAutogenerationEnabled, setIsAutogenerationEnabled] = useState(
    site?.autogeneration,
  );
  const [autogenPerDay, setAutogenPerDay] = useState(site?.autogenPerDay ?? 0);
  const [folder, setFolder] = useState(site?.folder ?? "");
  const { id } = useParams();
  const { data: listings = [], isLoading } = useListings(Number(id));
  const { data: folderList = [] } = useFolders(Number(id));
  const locale = useParams().locale as string;

  const folderOptions = folderList.map((f) => ({ label: f, value: f }));
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleView = (listing: Listing) => {
    setSelectedListing(listing);
    setIsDetailsOpen(true);
  };

  const queryClient = useQueryClient();
  const toggleMutation = useMutation({
    mutationFn: (enabled: boolean) =>
      SiteService.toggleAutogeneration(Number(id), enabled),
    onSuccess: () => {
      setIsAutogenerationEnabled((prev) => !prev);
      queryClient.invalidateQueries({ queryKey: siteKeys.all });
      toast.success("Autogeneration status updated");
    },
    onError: () => {
      toast.error("Failed to update autogeneration status");
    },
  });

  const handleToggle = (checked: boolean) => {
    toggleMutation.mutate(checked);
  };

  const autogenPerDayMutation = useMutation({
    mutationFn: (value: string) =>
      SiteService.updateAutogenPerDay(id as string, parseInt(value, 10)),
    onSuccess: (_data, value) => {
      setAutogenPerDay(parseInt(value, 10));
      queryClient.invalidateQueries({ queryKey: siteKeys.all });
      toast.success("Autogen per day updated");
    },
    onError: () => {
      toast.error("Failed to update autogen per day");
    },
  });

  const updateFolderMutation = useMutation({
    mutationFn: (value: string) => SiteService.updateFolder(Number(id), value),
    onSuccess: (_data, value) => {
      setFolder(value);
      queryClient.invalidateQueries({ queryKey: siteKeys.all });
      toast.success("Folder updated");
    },
    onError: () => {
      toast.error("Failed to update folder");
    },
  });

  const columns: ColumnDef<Listing>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="text-default-500">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "title",
      header: t.table_title.toUpperCase(),
      cell: ({ row }) => (
        <div className="font-bold text-default-900 line-clamp-1">
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: t.table_price.toUpperCase(),
      cell: ({ row }) => (
        <div className="font-semibold text-default-900">
          {row.getValue("price") || "0.00"} {site.currency}
        </div>
      ),
    },
    {
      accessorKey: "categoryName",
      header: t.table_category.toUpperCase(),
      cell: ({ row }) => (
        <Badge color="secondary">{row.getValue("categoryName")}</Badge>
      ),
    },
    {
      accessorKey: "status",
      header: t.table_status.toUpperCase(),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            color={status === "active" ? "success" : "warning"}
            className="capitalize"
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "viewsCount",
      header: t.table_views.toUpperCase(),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-default-600">
          <Icon icon="heroicons:eye" className="w-4 h-4" />
          {row.getValue("viewsCount")}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: t.table_date.toUpperCase(),
      cell: ({ row }) => (
        <div className="text-default-500 whitespace-nowrap">
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-end">{t.actions.toUpperCase()}</div>,
      cell: ({ row }) => {
        const actions = [
          {
            label: t.action_view,
            icon: <Eye />,
            onClick: () => handleView(row.original),
          },
          {
            label: t.action_delete,
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
    data: listings,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <PageLayout
      site={site}
      actionBlock={
        <CreateBtn locale={locale} id={Number(id)} text={t.create_listing} />
      }
    >
      <ListingDetailsDialog
        listing={selectedListing}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        currency={site.currency}
        translations={t}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticsBlock
          title={t.stats_total}
          total={listings.length.toString()}
          chartColor="#3b82f6"
          series={[10, 15, 8, 22, 18, 25, 30]}
        />
        <ActionBlock
          title={t.stats_autogeneration}
          value={isAutogenerationEnabled ? "Enabled" : "Disabled"}
          icon={<Icon icon="heroicons:bolt" className="w-6 h-6" />}
          action={
            <Switch
              checked={isAutogenerationEnabled}
              onCheckedChange={handleToggle}
              disabled={toggleMutation.isPending}
              color="success"
              size="sm"
            />
          }
        />
        <EditableActionBlock
          title={t.stats_autogen_per_day}
          value={autogenPerDay}
          type="number"
          min={0}
          icon={<Icon icon="heroicons:clock" className="w-6 h-6" />}
          isPending={autogenPerDayMutation.isPending}
          onSave={(v) => autogenPerDayMutation.mutate(v)}
        />
        <EditableActionBlock
          title={t.stats_images_folder}
          value={folder || ""}
          type="select"
          options={
            folderList.length > 0
              ? folderList.map((f) => ({ label: f.name, value: f.name }))
              : [{ label: folder || "N/A", value: folder || "" }]
          }
          icon={<Icon icon="heroicons:folder" className="w-6 h-6" />}
          isPending={updateFolderMutation.isPending}
          onSave={(v) => updateFolderMutation.mutate(v)}
        />
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="py-6 px-6">
          <CardTitle className="text-xl font-bold text-default-900">
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-default-50 border-y border-default-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-12 px-6 font-bold text-[11px] uppercase tracking-wider text-default-900"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
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
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-default-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-6 py-4">
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

          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-6">
              <div className="text-sm text-default-500 font-medium whitespace-nowrap">
                Showing {table.getRowModel().rows.length} of {listings.length}{" "}
                results
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-default-500 whitespace-nowrap">
                  Rows per page:
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

                {Array.from({ length: table.getPageCount() }, (_, i) => {
                  const isPageActive =
                    table.getState().pagination.pageIndex === i;
                  // Show current page, first and last pages, and pages around current
                  if (
                    i === 0 ||
                    i === table.getPageCount() - 1 ||
                    Math.abs(table.getState().pagination.pageIndex - i) <= 1
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
                  if (
                    Math.abs(table.getState().pagination.pageIndex - i) === 2
                  ) {
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
                      !table.getCanNextPage()
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
