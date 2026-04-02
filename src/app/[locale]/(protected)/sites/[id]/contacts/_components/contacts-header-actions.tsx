"use client";

import React from "react";
import { ActionBtn } from "@/components/ui-kit/table/action-btn";
import { useTranslations } from "next-intl";
import { ContactFormDialog } from "@/app/[locale]/(protected)/sites/[id]/contacts/_components/ContactFormDialog";

interface ContactsHeaderActionsProps {
  siteId: number;
}

export function ContactsHeaderActions({ siteId }: ContactsHeaderActionsProps) {
  const t = useTranslations("Contacts");
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <ActionBtn text={t("action_create")} onClick={() => setOpen(true)} />
      <ContactFormDialog
        siteId={siteId}
        isOpen={open}
        onClose={() => setOpen(false)}
        contact={null}
      />
    </>
  );
}
