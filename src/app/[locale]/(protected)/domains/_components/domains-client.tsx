"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PageLayout } from "../../sites/_components/page-layout";
import { BuyDomainDialog } from "./buy-domain-dialog";
import { DomainsTable } from "./domains-table";

interface DomainsClientProps {
  title: string;
}

export function DomainsClient({ title }: DomainsClientProps) {
  const t = useTranslations("DomainsManagement");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <PageLayout
        title={title}
        actionBlock={
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("action_buy_domain")}
          </Button>
        }
      >
        <DomainsTable />
      </PageLayout>

      <BuyDomainDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
