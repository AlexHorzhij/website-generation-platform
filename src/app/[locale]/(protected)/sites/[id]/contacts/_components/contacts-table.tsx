"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
import { Edit, Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui-kit/table/data-table";
import { TableActions } from "@/components/ui-kit/table/table-actions";
import { Contact } from "@/api/types/contact";
import { useContacts, useDeleteContact } from "@/api/hooks/use-contacts";
import { ContactFormDialog } from "@/app/[locale]/(protected)/sites/[id]/contacts/_components/ContactFormDialog";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";

interface ContactsTableProps {
  siteId: number;
}

export function ContactsTable({ siteId }: ContactsTableProps) {
  const { data = [], isLoading, error } = useContacts(siteId);
  const deleteMutation = useDeleteContact(siteId);

  const t = useTranslations("Contacts");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsDialogOpen(true);
  };

  const handleDeleteRequest = (contact: Contact) => {
    setContactToDelete(contact);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (contactToDelete) {
      deleteMutation.mutate(contactToDelete.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setContactToDelete(null);
        },
      });
    }
  };

  const columns: ColumnDef<Contact>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="text-default-500 font-medium">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "number",
      header: t("table_phone_number").toUpperCase(),
      cell: ({ row }) => (
        <div className="font-bold text-default-900 whitespace-nowrap">
          {row.original.number}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className="text-end">{t("table_actions").toUpperCase()}</div>
      ),
      cell: ({ row }) => {
        const actions = [
          {
            label: t("action_edit"),
            icon: <Edit className="w-4 h-4" />,
            onClick: () => handleEdit(row.original),
          },
          {
            label: t("action_delete"),
            icon: <Trash2 className="w-4 h-4" />,
            onClick: () => handleDeleteRequest(row.original),
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

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <DataTable
        table={table}
        totalItems={data.length}
        title={t("table_title")}
        filterColumn="number"
        filterPlaceholder={t("filter_placeholder")}
        isLoading={isLoading}
      />

      <ContactFormDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingContact(null);
        }}
        siteId={siteId}
        contact={editingContact}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
        title={t("delete_contact")}
        description={t("delete_contact_description", {
          number: contactToDelete?.number ?? "",
        })}
      />
    </>
  );
}
