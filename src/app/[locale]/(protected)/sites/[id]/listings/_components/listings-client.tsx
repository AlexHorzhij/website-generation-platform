"use client";

import { useRouter } from "@/components/navigation";

import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  PaginationState,
} from "@tanstack/react-table";
import { Eye, Trash2, Pencil } from "lucide-react";

import { DataTable, TableActions } from "@/components/ui-kit/table";
import { Listing } from "@/api/types/listing";
import { Site } from "@/api/types/site";
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
import { useState } from "react";
import { EditListingFormDialog } from "./edit-listing-form-dialog";

import { useTranslations } from "next-intl";

interface ListingsClientProps {
  site: Site;
}

export default function ListingsClient({ site }: ListingsClientProps) {
  const t = useTranslations("Listings");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [isAutogenerationEnabled, setIsAutogenerationEnabled] = useState(
    site?.autogeneration,
  );
  const [autogenPerDay, setAutogenPerDay] = useState(site?.autogenPerDay ?? 0);
  const [folder, setFolder] = useState(site?.folder ?? "");

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);

  const { id } = useParams();
  const router = useRouter();

  const { data: listings = [], isLoading } = useListings(Number(id));
  const { data: folderList = [] } = useFolders(Number(id));

  const handleView = (listing: Listing) => {
    router.push(`/sites/${id}/listings/${listing.id}`);
  };

  const handleEdit = (listing: Listing) => {
    setSelectedListing(listing);
    setIsEditDialogOpen(true);
  };

  const queryClient = useQueryClient();
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
      cell: ({ row }) => (
        <div className="text-default-500">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "title",
      header: t("table_title").toUpperCase(),
      cell: ({ row }) => (
        <div className="font-bold text-default-900 line-clamp-1">
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: t("table_price").toUpperCase(),
      cell: ({ row }) => (
        <div className="font-semibold text-default-900 uppercase">
          {row.getValue("price") || "0.00"} {site.currency}
        </div>
      ),
    },
    {
      accessorKey: "categoryName",
      header: t("table_category").toUpperCase(),
      cell: ({ row }) => (
        <Badge color="secondary">{row.getValue("categoryName")}</Badge>
      ),
    },
    {
      accessorKey: "status",
      header: t("table_status").toUpperCase(),
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
      header: t("table_views").toUpperCase(),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-default-600">
          <Icon icon="heroicons:eye" className="w-4 h-4" />
          {row.getValue("viewsCount")}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: t("table_date").toUpperCase(),
      cell: ({ row }) => (
        <div className="text-default-500 whitespace-nowrap">
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className="text-end">{t("actions").toUpperCase()}</div>
      ),
      cell: ({ row }) => {
        const actions = [
          {
            label: t("action_view"),
            icon: <Eye />,
            onClick: () => handleView(row.original),
          },
          {
            label: t("edit_listing") || "Edit",
            icon: <Pencil />,
            onClick: () => handleEdit(row.original),
          },
          {
            label: t("action_delete"),
            icon: <Trash2 />,
            onClick: () => handleDelete(row.original),
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
    <div className="space-y-6">
      {selectedListing && (
        <EditListingFormDialog
          siteId={Number(id)}
          listing={selectedListing}
          isOpen={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setSelectedListing(null);
          }}
        />
      )}

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

      <DataTable
        table={table}
        totalItems={listings.length}
        title={t("title")}
        isLoading={isLoading}
        onRowClick={(row) => handleView(row)}
      />

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
}
