"use client";

import React from "react";
import { ActionBtn } from "@/components/ui-kit/table/action-btn";
import { CreateAxisDialog } from "./create-axis-dialog";
import { useTranslations } from "next-intl";

interface AxesHeaderActionsProps {
  siteId: number;
}

export const AxesHeaderActions = ({ siteId }: AxesHeaderActionsProps) => {
  const t = useTranslations("AxesManagement");
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <ActionBtn
        text={t("add_axis")}
        icon="heroicons-outline:plus"
        onClick={() => setIsOpen(true)}
      />
      <CreateAxisDialog
        siteId={siteId}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
};
