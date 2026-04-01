"use client";

import { useRouter } from "@/components/navigation";

import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { Eye, Trash2, Pencil } from "lucide-react";

import { TableActions } from "@/components/ui-kit/table/table-actions";
import { TablePagination } from "@/components/ui-kit/table/table-pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Listing } from "@/api/types/listing";
import { siteKeys } from "@/api/hooks/use-sites";
import { useListings, useFolders } from "@/api/hooks/use-listings";
import { ListingService } from "@/api/services/listing-service";
import { SiteService } from "@/api/services/site-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { StatisticsBlock } from "@/components/blocks/statistics-block";
import { ActionBlock } from "@/components/blocks/action-block";
import { EditableActionBlock } from "@/components/blocks/editable-action-block";
import { Switch } from "@/components/ui/switch";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import React, { useState } from "react";
import { useTranslations } from "next-intl";

interface ListingsClientProps {
  initialSite: any;
}

export default function ListingsClient({ site }: { site: any }) {
  const router = useRouter();
  const t = useTranslations("Listings");
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [isAutogenerationEnabled, setIsAutogenerationEnabled] = useState(
    site.autogeneration,
  );
  const [autogenPerDay, setAutogenPerDay] = useState(site.autogenPerDay);
  const [folder, setFolder] = useState(site.folder);

  const { data: listings = [] } = useListings(id as string);
  const { data: folderList = [] } = useFolders(id as string);

  const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const toggleMutation = useMutation({
    mutationFn: (enabled: boolean) =>
      SiteService.toggleAutogeneration(Number(id), enabled),
    onSuccess: () => {
      setIsAutogenerationEnabled((prev: boolean) => !prev);
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

  const deleteMutation = useMutation({
    mutationFn: (listingId: number) => ListingService.deleteListing(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteKeys.all });
      toast.success("Listing deleted successfully");
      setIsDeleteDialogOpen(false);
      setListingToDelete(null);
    },
    onError: () => {
      toast.error("Failed to delete listing");
    },
  });

  const handleDelete = (listing: Listing) => {
    setListingToDelete(listing);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (listingToDelete) {
      deleteMutation.mutate(listingToDelete.id);
    }
  };

  const columns: ColumnDef<Listing>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <span className="font-medium">#{row.original.id}</span>,
    },
    {
      accessorKey: "title",
      header: t("table_title"),
      cell: ({ row }) => (
        <span className="font-medium text-default-900 leading-relaxed block max-w-[300px] truncate">
          {row.original.title}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: t("table_price"),
      cell: ({ row }) => (
        <span className="font-semibold text-default-700">
          {row.original.price} {site.currency}
        </span>
      ),
    },
    {
      accessorKey: "categoryName",
      header: t("table_category"),
      cell: ({ row }) => (
        <Badge color="default" className="font-normal opacity-80">
          {row.original.categoryName}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: t("table_status"),
      cell: ({ row }) => (
        <Badge
          color={row.original.status === "active" ? "success" : "warning"}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "viewsCount",
      header: t("table_views"),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-default-500">
          <Eye className="w-4 h-4" />
          <span className="text-sm font-medium">{row.original.viewsCount}</span>
        </div>
      ),
    },
    {
      id: "actions",
      header: t("actions"),
      cell: ({ row }) => (
        <TableActions
          actions={[
            {
              label: t("action_view"),
              icon: <Eye className="w-4 h-4" />,
              onClick: () =>
                router.push(
                  `/(protected)/sites/${id}/listings/${row.original.id}`,
                ),
            },
            {
              label: t("action_delete"),
              icon: <Trash2 className="w-4 h-4" />,
              onClick: () => handleDelete(row.original),
              variant: "destructive",
            },
          ]}
        />
      ),
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticsBlock
          title={t("stats_total")}
          total={listings.length.toString()}
          chartColor="#3b82f6"
          series={[10, 15, 8, 22, 18, 25, 30]}
        />
        <ActionBlock
          title={t("stats_autogeneration")}
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
          title={t("stats_autogen_per_day")}
          value={autogenPerDay}
          type="number"
          min={0}
          icon={<Icon icon="heroicons:clock" className="w-6 h-6" />}
          isPending={autogenPerDayMutation.isPending}
          onSave={(v) => autogenPerDayMutation.mutate(v)}
        />
        <EditableActionBlock
          title={t("stats_images_folder")}
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
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-default-50/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-default-600 font-bold px-6 py-4"
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
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-default-50/50 transition-colors border-default-100"
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
                    className="h-24 text-center text-default-500 italic"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination table={table} totalItems={listings.length} />
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
        description={
          listingToDelete
            ? `This will permanently delete the listing "${listingToDelete.title}" and remove it from our servers.`
            : undefined
        }
      />
    </div>
  );
};
