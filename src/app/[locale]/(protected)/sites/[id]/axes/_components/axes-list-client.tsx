"use client";

import { useSiteAxes, useDeleteAxis } from "@/api/hooks/use-axes";
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
import { Button } from "@/components/ui/button";
import { EditAxisDialog } from "./edit-axis-dialog";
import * as React from "react";
import { toast } from "sonner";
import { AxisService } from "@/api/services/axis-service";
import { TableActions } from "@/components/ui-kit/table/table-actions";

interface AxesListClientProps {
  siteId: number;
}

export const AxesListClient = ({ siteId }: AxesListClientProps) => {
  const { data: axes = [], isLoading } = useSiteAxes(siteId);
  console.log("axes", axes);
  const deleteAxis = useDeleteAxis();
  const t = useTranslations("AxesManagement");

  const [selectedAxis, setSelectedAxis] = React.useState<Axis | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isReadOnly, setIsReadOnly] = React.useState(false);

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
    toast.error("Are you sure?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await deleteAxis.mutateAsync(id);
            toast.success("Axis deleted successfully");
          } catch (error) {
            toast.error("Failed to delete axis");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
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
        acc[axis.type] = [];
      }
      acc[axis.type].push(axis);
      return acc;
    },
    {} as Record<AxisType, Axis[]>,
  );

  const types = Object.keys(groupedAxes).sort();
  console.log("groupedAxes", groupedAxes);

  AxisService.getAxes();

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
                <AccordionTrigger className="capitalize">
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{type.replace(/_/g, " ")}</span>
                    <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {groupedAxes[type].length}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-4 pt-2">
                    {groupedAxes[type].map((axis) => (
                      <li
                        key={axis.id}
                        className="p-4 bg-default-50 dark:bg-slate-800 rounded-lg border border-default-200 relative group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-default-900 italic">
                            #{axis.id}
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
                        <p className="text-sm text-default-700 leading-relaxed whitespace-pre-wrap">
                          {axis.content}
                        </p>
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
    </>
  );
};
