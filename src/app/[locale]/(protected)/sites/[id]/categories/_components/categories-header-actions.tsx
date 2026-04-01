"use client";

import React from "react";
import { ActionBtn } from "@/components/ui-kit/table/action-btn";
import { useTranslations } from "next-intl";
import { CreateCategoryDialog } from "./create-category-dialog";

interface CategoriesHeaderActionsProps {
  siteId: number;
}

export function CategoriesHeaderActions({
  siteId,
}: CategoriesHeaderActionsProps) {
  const t = useTranslations("CategoriesManagement");
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <ActionBtn text={t("add_category")} onClick={() => setOpen(true)} />
      <CreateCategoryDialog
        siteId={siteId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
