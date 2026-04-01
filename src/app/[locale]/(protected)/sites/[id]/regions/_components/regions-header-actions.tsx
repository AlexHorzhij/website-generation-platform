"use client";

import React from "react";
import { ActionBtn } from "@/components/ui-kit/table/action-btn";
import { useTranslations } from "next-intl";
import { CreateRegionDialog } from "./create-region-dialog";

interface RegionsHeaderActionsProps {
  siteId: number;
}

export function RegionsHeaderActions({ siteId }: RegionsHeaderActionsProps) {
  const t = useTranslations("RegionsManagement");
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <ActionBtn text={t("add_region")} onClick={() => setOpen(true)} />
      <CreateRegionDialog
        siteId={siteId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
