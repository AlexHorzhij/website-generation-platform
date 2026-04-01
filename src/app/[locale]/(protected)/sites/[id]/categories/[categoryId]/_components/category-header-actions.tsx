"use client";

import React from "react";
import { ActionBtn } from "@/components/ui-kit/table/action-btn";
import { useTranslations } from "next-intl";
import { Category } from "@/api/types/site";
import { EditCategoryDialog } from "../../_components/edit-category-dialog";

interface CategoryHeaderActionsProps {
  siteId: number;
  category: Category;
}

export function CategoryHeaderActions({
  siteId,
  category,
}: CategoryHeaderActionsProps) {
  const t = useTranslations("CategoriesManagement");
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <ActionBtn
        text={t("edit_category")}
        onClick={() => setOpen(true)}
        icon="heroicons:pencil"
      />
      <EditCategoryDialog
        siteId={siteId}
        category={category}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
