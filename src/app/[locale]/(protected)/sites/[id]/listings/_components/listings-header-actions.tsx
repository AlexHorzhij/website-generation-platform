"use client";

import React from "react";
import { ActionBtn } from "@/components/ui-kit/table/action-btn";
import { useTranslations } from "next-intl";
import { CreateListingFormDialog } from "./create-listing-form-dialog";

interface ListingsHeaderActionsProps {
  siteId: number;
}

export function ListingsHeaderActions({ siteId }: ListingsHeaderActionsProps) {
  const t = useTranslations("Listings");
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <ActionBtn text={t("create_listing")} onClick={() => setOpen(true)} />
      <CreateListingFormDialog
        siteId={siteId}
        isOpen={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
