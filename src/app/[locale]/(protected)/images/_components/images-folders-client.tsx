"use client";

import { useState } from "react";
import { useAllFolders, useDeleteFolder } from "@/api/hooks/use-images";
import { useTranslations } from "next-intl";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "@/components/ui-kit/table/data-table";
import { TableActions } from "@/components/ui-kit/table/table-actions";
import { Eye, Trash2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { ImageFolderType } from "@/api/types/images";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { toast } from "sonner";

export default function ImagesFoldersClient() {
  const t = useTranslations("ImagesManagement");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const { data: folders = [], isLoading } = useAllFolders();
  const deleteMutation = useDeleteFolder();

  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Using siteId 1 as in global service for now
  const siteId = 1;

  const handleView = (folderName: string) => {
    router.push(`/${locale}/images/${folderName}`);
  };

  const handleDeleteRequest = (folderName: string) => {
    setFolderToDelete(folderName);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (folderToDelete) {
      deleteMutation.mutate(
        { siteId, folderName: folderToDelete },
        {
          onSuccess: () => {
            setIsDeleteDialogOpen(false);
            setFolderToDelete(null);
            toast.success(t("delete_folder_success"));
          },
        },
      );
    }
  };

  const columns: ColumnDef<ImageFolderType>[] = [
    {
      accessorKey: "name",
      header: t("table_folder_name").toUpperCase(),
      cell: ({ row }) => (
        <div className="font-bold text-default-900">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "amount",
      header: t("images_count").toUpperCase(),
      cell: ({ row }) => (
        <div className="text-default-500">{row.original.amount}</div>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className="text-end">{t("table_actions").toUpperCase()}</div>
      ),
      cell: ({ row }) => {
        const folder = row.original;
        const actions = [
          {
            label: t("action_view"),
            icon: <Eye className="w-4 h-4" />,
            onClick: () => handleView(folder.name),
          },
          {
            label: t("action_delete"),
            icon: <Trash2 className="w-4 h-4" />,
            onClick: () => handleDeleteRequest(folder.name),
            variant: "destructive" as const,
          },
        ];

        return <TableActions actions={actions} />;
      },
    },
  ];

  const table = useReactTable({
    data: folders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      <DataTable
        table={table}
        totalItems={folders.length}
        title={t("folders_table_title")}
        isLoading={isLoading}
        onRowClick={(row) => handleView(row.name)}
        noResultsMessage={t("no_folders_found")}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
        title={t("delete_folder_title")}
        description={t("delete_folder_description", {
          name: folderToDelete ?? "",
        })}
      />
    </div>
  );
}
