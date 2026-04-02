"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Contact } from "@/api/types/contact";
import { useCreateContact, useUpdateContact } from "@/api/hooks/use-contacts";
import { toast } from "sonner";
import { DialogModal } from "@/components/ui-kit/table/dialog-modal";

interface ContactFormDialogProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  siteId: number;
}

export function ContactFormDialog({
  contact,
  isOpen,
  onClose,
  siteId,
}: ContactFormDialogProps) {
  const t = useTranslations("Contacts");
  const createContact = useCreateContact(siteId);
  const updateContact = useUpdateContact(siteId);

  const isPending = createContact.isPending || updateContact.isPending;

  const [number, setNumber] = React.useState("");

  React.useEffect(() => {
    if (contact) {
      setNumber(contact.number);
    } else {
      setNumber("");
    }
  }, [contact, isOpen]);

  const handleSave = async () => {
    if (!number) {
      toast.error(t("error_number_required"));
      return;
    }

    try {
      if (contact) {
        await updateContact.mutateAsync({
          id: contact.id,
          data: { number },
        });
      } else {
        await createContact.mutateAsync({
          number,
        });
      }
      onClose();
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <DialogModal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={contact ? t("edit_contact") : t("create_contact")}
      onSave={handleSave}
      isLoading={isPending}
    >
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="number">{t("field_number")}</Label>
          <Input
            id="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="+1 234 567 8900"
          />
        </div>
      </div>
    </DialogModal>
  );
}
