import { getQueryClient } from "@/lib/get-query-client";
import { SiteService } from "@/api/services/site-service";
import { siteKeys } from "@/api/hooks/use-sites";
import SiteDetailsClient from "./_components/site-details-client";
import { SiteDetailsPreview } from "../_components/site-details-preview";
import { PageLayout } from "@/components/layouts/page-layout";
import { EditSiteAction } from "./_components/edit-site-action";
import { getTranslations } from "next-intl/server";

import { SitePageLayout } from "../_components/site-page-layout";

interface SiteDetailsPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

const SiteDetailsPage = async ({ params }: SiteDetailsPageProps) => {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: "General" });

  const site = await SiteService.getSiteById(Number(id));

  if (!site) {
    return <div>Site not found</div>;
  }

  return (
    <SitePageLayout
      site={site}
      actionBlock={<EditSiteAction site={site} text={t("edit")} />}
    >
      <div className="space-y-6">
        <SiteDetailsClient site={site} locale={locale} />
        <SiteDetailsPreview site={site} locale={locale} />
      </div>
    </SitePageLayout>
  );
};

export default SiteDetailsPage;
