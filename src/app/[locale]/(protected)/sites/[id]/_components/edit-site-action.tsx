"use client";

import { useState } from "react";
import { ActionBtn } from "@/components/ui-kit/table/action-btn";
import { EditSiteFormDialog } from "./edit-site-form-dialog";
import { Site } from "@/api/types/site";

interface EditSiteActionProps {
  site: Site;
  text: string;
}

export function EditSiteAction({ site, text }: EditSiteActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ActionBtn
        text={text}
        onClick={() => setIsOpen(true)}
        icon="heroicons:pencil-square"
      />
      {isOpen && (
        <EditSiteFormDialog
          site={site}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        />
      )}
    </>
  );
}
