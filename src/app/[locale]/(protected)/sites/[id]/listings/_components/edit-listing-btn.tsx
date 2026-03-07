"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { EditListingFormDialog } from "./edit-listing-form-dialog";
import { Listing } from "@/api/types/listing";

import { useTranslations } from "next-intl";

interface EditListingBtnProps {
  listing: Listing;
  siteId: number;
}

export function EditListingBtn({ listing, siteId }: EditListingBtnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Listings");

  return (
    <>
      <Button size="sm" onClick={() => setIsOpen(true)}>
        <Icon icon="heroicons:pencil-square" className="w-4 h-4 mr-2" />
        {t("edit_listing")}
      </Button>
      <EditListingFormDialog
        siteId={siteId}
        listing={listing}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
}
