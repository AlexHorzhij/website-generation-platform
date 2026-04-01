"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Pencil, Trash2, ChevronDown } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TableActions } from "@/components/ui-kit/table/table-actions";
import { CountBadge } from "@/components/ui-kit/count-badge";
import { useSiteRegions, useDeleteRegion } from "@/api/hooks/use-sites";
import { Region } from "@/api/types/site";
import { cn } from "@/lib/utils";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { EditRegionDialog } from "./edit-region-dialog";
import { TableAccordionRow } from "@/components/ui-kit/table/table-accordion-row";

interface RegionsListClientProps {
  siteId: number;
}

export function RegionsListClient({ siteId }: RegionsListClientProps) {
  const t = useTranslations("RegionsManagement");
  const { data: regions = [], isLoading } = useSiteRegions(siteId);
  const deleteRegionMutation = useDeleteRegion(siteId);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [regionToDelete, setRegionToDelete] = React.useState<number | null>(
    null,
  );

  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [regionToEdit, setRegionToEdit] = React.useState<Region | null>(null);

  const groupedRegions = React.useMemo(() => {
    const parents: Region[] = [];
    const childrenMap = new Map<number, Region[]>();

    regions.forEach((region) => {
      if (!region.parentId) {
        parents.push(region);
      } else {
        if (!childrenMap.has(region.parentId)) {
          childrenMap.set(region.parentId, []);
        }
        childrenMap.get(region.parentId)!.push(region);
      }
    });

    return { parents, childrenMap };
  }, [regions]);

  const handleDeleteClick = (id: number) => {
    setRegionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (regionToDelete) {
      deleteRegionMutation.mutate(regionToDelete, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setRegionToDelete(null);
        },
      });
    }
  };

  const handleEditClick = (region: Region) => {
    setRegionToEdit(region);
    setEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="border-none shadow-sm p-6">
        <div className="text-center text-default-500">Loading...</div>
      </Card>
    );
  }

  if (regions.length === 0) {
    return (
      <Card className="border-none shadow-sm p-6">
        <div className="text-center text-default-500">
          {t("no_regions_found")}
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {groupedRegions.parents.map((parent) => {
              const children = groupedRegions.childrenMap.get(parent.id) || [];
              return (
                <AccordionItem
                  key={parent.id}
                  value={`parent-${parent.id}`}
                  className="border-none shadow-none mb-4"
                >
                  <div className="flex items-center w-full bg-default-100 rounded-md overflow-hidden relative">
                    <AccordionPrimitive.Header className="flex flex-1">
                      <AccordionPrimitive.Trigger
                        className={cn(
                          "flex flex-1 items-center justify-between p-4 text-default-900 font-medium transition-all duration-200 [&[data-state=open]>svg]:rotate-180 text-left cursor-pointer",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-default-900 text-base">
                            {parent.name}
                          </span>
                          <Badge className="font-mono text-[16px] h-5 bg-default-80 text-default-600 border-none">
                            {parent.code}
                          </Badge>
                          <CountBadge count={children.length} />
                        </div>
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform easy-in-out duration-200 mr-12" />
                      </AccordionPrimitive.Trigger>
                    </AccordionPrimitive.Header>

                    <div className="absolute right-4 flex items-center gap-8">
                      <div className="flex flex-col items-end mr-2">
                        <span className="font-semibold text-default-700">
                          {parent.listingsCount}
                        </span>
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <TableActions
                          actions={[
                            {
                              label: t("edit_region") || "Edit",
                              icon: <Pencil className="w-4 h-4" />,
                              onClick: () => handleEditClick(parent),
                            },
                            {
                              label: "Delete",
                              icon: <Trash2 className="w-4 h-4" />,
                              onClick: () => handleDeleteClick(parent.id),
                              variant: "destructive" as const,
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  <AccordionContent className="p-0 border-t border-default-100 bg-default-50/20 dark:bg-slate-900 rounded-b-md">
                    {children.length > 0 ? (
                      <ul className="divide-y divide-default-100">
                        {children.map((child) => (
                          <TableAccordionRow
                            key={child.id}
                            title={child.name}
                            info={child.code}
                            stats={child.listingsCount}
                            actions={[
                              {
                                label: t("edit_region") || "Edit",
                                icon: <Pencil className="w-4 h-4" />,
                                onClick: () => handleEditClick(child),
                              },
                              {
                                label: "Delete",
                                icon: <Trash2 className="w-4 h-4" />,
                                onClick: () => handleDeleteClick(child.id),
                                variant: "destructive" as const,
                              },
                            ]}
                          />
                        ))}
                      </ul>
                    ) : (
                      <div className="p-8 text-center text-default-400 italic text-xs">
                        {t("no_regions_found")}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isPending={deleteRegionMutation.isPending}
      />

      {regionToEdit && (
        <EditRegionDialog
          siteId={siteId}
          region={regionToEdit}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
    </>
  );
}
