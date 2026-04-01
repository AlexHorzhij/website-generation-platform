"use client";

import { useSiteAxes, useDeleteAxis, useAxeTypes } from "@/api/hooks/use-axes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2, Eye, Pencil, Trash2 } from "lucide-react";
import { Axis, AxisType } from "@/api/types/axis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { EditAxisDialog } from "./edit-axis-dialog";
import * as React from "react";
import { TableActions } from "@/components/ui-kit/table/table-actions";
import { CountBadge } from "@/components/ui-kit/count-badge";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";

interface AxesListClientProps {
  siteId: number;
}

export const AxesListClient = ({ siteId }: AxesListClientProps) => {
  const { data: axes = [], isLoading } = useSiteAxes(siteId);
  const { data: axesTypes } = useAxeTypes();
  const deleteAxis = useDeleteAxis();
  const t = useTranslations("AxesManagement");

  const [selectedAxis, setSelectedAxis] = React.useState<Axis | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isReadOnly, setIsReadOnly] = React.useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [axisToDelete, setAxisToDelete] = React.useState<number | null>(null);

  const handleEdit = (axis: Axis) => {
    setSelectedAxis(axis);
    setIsReadOnly(false);
    setIsEditDialogOpen(true);
  };

  const handleView = (axis: Axis) => {
    setSelectedAxis(axis);
    setIsReadOnly(true);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setAxisToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (axisToDelete) {
      await deleteAxis.mutateAsync(axisToDelete);
      setIsDeleteDialogOpen(false);
      setAxisToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (axes.length === 0) {
    return (
      <div className="text-center py-12 text-default-500">
        {t("no_axes_found")}
      </div>
    );
  }

  // Group axes by type
  const groupedAxes = axes.reduce(
    (acc, axis) => {
      if (!acc[axis.type]) {
        const typeInfo = axesTypes?.find((t) => t.type === axis.type);
        acc[axis.type] = {
          name: typeInfo?.name || axis.type.replace(/_/g, " "),
          description: typeInfo?.description || "",
          axes: [],
        };
      }
      acc[axis.type].axes.push(axis);
      return acc;
    },
    {} as Record<AxisType, { name: string; description: string; axes: Axis[] }>,
  );

  const types = Object.keys(groupedAxes).sort();

  return (
    <>
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle>{t("list_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {types.map((type) => (
              <AccordionItem key={type} value={type}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex flex-col items-start gap-1 text-left">
                    <div className="flex items-center gap-3">
                      <span className="font-bold capitalize">
                        {groupedAxes[type].name}
                      </span>
                      <CountBadge count={groupedAxes[type].axes.length} />
                    </div>
                    {groupedAxes[type].description && (
                      <span className="text-sm font-normal text-default-500">
                        {groupedAxes[type].description}
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-4 pt-2">
                    {groupedAxes[type].axes.map((axis) => (
                      <li
                        key={axis.id}
                        className="py-2 px-4 bg-default-50 dark:bg-slate-800 rounded-lg border border-default-200 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-default-700 leading-relaxed whitespace-pre-wrap">
                            <span className="font-bold mr-2">#{axis.id}</span>
                            <span>{axis.content}</span>
                          </p>
                          <div>
                            <TableActions
                              actions={[
                                {
                                  label: t("action_view") || "View",
                                  icon: <Eye className="w-4 h-4" />,
                                  onClick: () => handleView(axis),
                                },
                                {
                                  label: t("edit_axis") || "Edit",
                                  icon: <Pencil className="w-4 h-4" />,
                                  onClick: () => handleEdit(axis),
                                },
                                {
                                  label: t("action_delete") || "Delete",
                                  icon: <Trash2 className="w-4 h-4" />,
                                  onClick: () => handleDelete(axis.id),
                                  variant: "destructive" as const,
                                },
                              ]}
                            />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <EditAxisDialog
        axis={selectedAxis}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        readOnly={isReadOnly}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        isPending={deleteAxis.isPending}
      />
    </>
  );
};
