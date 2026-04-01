"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Pencil, Trash2, Eye, Globe } from "lucide-react";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
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
import { useSiteCategories, useDeleteCategory } from "@/api/hooks/use-sites";
import { Category } from "@/api/types/site";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { EditCategoryDialog } from "./edit-category-dialog";

import { useRouter, useParams } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CategoriesListClientProps {
  siteId: number;
}

export function CategoriesListClient({ siteId }: CategoriesListClientProps) {
  const t = useTranslations("CategoriesManagement");
  const { data: categories = [], isLoading } = useSiteCategories(siteId);
  const deleteMutation = useDeleteCategory(siteId);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    React.useState<Category | null>(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [categoryToEdit, setCategoryToEdit] = React.useState<Category | null>(
    null,
  );

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setCategoryToDelete(null);
        },
      });
    }
  };

  const handleEditClick = (category: Category) => {
    setCategoryToEdit(category);
    setEditDialogOpen(true);
  };

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "id",
      header: "ID",
      size: 50,
      cell: ({ row }) => (
        <div className="text-default-500">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: t("table_name").toUpperCase(),
      size: 180,
      cell: ({ row }) => (
        <div>
          <div className="font-bold text-default-900 line-clamp-1">
            {row.getValue("name")}
          </div>
          {row.original.nameEn && (
            <div className="text-xs text-default-400 line-clamp-1 mt-0.5">
              {row.original.nameEn}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: t("table_description").toUpperCase(),
      size: 400,
      cell: ({ row }) => {
        const text = (row.getValue("description") as string) || "—";
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-default-600 text-sm line-clamp-2">
                  {text}
                </div>
              </TooltipTrigger>
              {text.length > 150 && (
                <TooltipContent className="max-w-[400px] border-none shadow-xl bg-slate-800 text-white p-3 rounded-lg leading-relaxed">
                  {text}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "descriptionEn",
      header: t("field_description_en").toUpperCase(),
      size: 400,
      cell: ({ row }) => {
        const text = (row.getValue("descriptionEn") as string) || "—";
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-default-600 text-sm line-clamp-2">
                  {text}
                </div>
              </TooltipTrigger>
              {text.length > 150 && (
                <TooltipContent className="max-w-[400px] border-none shadow-xl bg-slate-800 text-white p-3 rounded-lg leading-relaxed">
                  {text}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      id: "actions",
      size: 150,
      header: () => (
        <div className="text-end">{t("table_actions").toUpperCase()}</div>
      ),
      cell: ({ row }) => (
        <TableActions
          actions={[
            {
              label: t("action_view") || "View",
              icon: <Eye className="w-4 h-4" />,
              onClick: () =>
                router.push(
                  `/${locale}/sites/${siteId}/categories/${row.original.id}`,
                ),
            },
            {
              label: t("action_view_seo") || "SEO Info",
              icon: <Globe className="w-4 h-4" />,
              onClick: () =>
                router.push(
                  `/${locale}/sites/${siteId}/categories/${row.original.id}/seo`,
                ),
            },
            {
              label: t("edit_category"),
              icon: <Pencil className="w-4 h-4" />,
              onClick: () => handleEditClick(row.original),
            },
            {
              label: t("delete_category"),
              icon: <Trash2 className="w-4 h-4" />,
              onClick: () => handleDeleteClick(row.original),
              variant: "destructive" as const,
            },
          ]}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="py-6 px-6">
          <CardTitle className="text-xl font-bold text-default-900">
            {t("title")}
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
                      style={{ width: `${header.getSize()}px` }}
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
                    className="hover:bg-default-50 transition-colors cursor-pointer"
                    onDoubleClick={() =>
                      router.push(
                        `/${locale}/sites/${siteId}/categories/${row.original.id}`,
                      )
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-6 py-4"
                        style={{ width: `${cell.column.getSize()}px` }}
                      >
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
                    {t("no_categories_found")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {categories.length > 10 && (
            <TablePagination table={table} totalItems={categories.length} />
          )}
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
        description={
          categoryToDelete
            ? `This will permanently delete the category "${categoryToDelete.name}".`
            : undefined
        }
      />

      {categoryToEdit && (
        <EditCategoryDialog
          siteId={siteId}
          category={categoryToEdit}
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) setCategoryToEdit(null);
          }}
        />
      )}
    </>
  );
}
