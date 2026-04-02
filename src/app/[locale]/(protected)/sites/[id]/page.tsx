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
  const { id } = await params;
  const t = await getTranslations("General");

  const site = await SiteService.getSiteById(Number(id));

  if (!site) {
    return <div>Site not found</div>;
  }

  return (
    <SitePageLayout
      site={site}
      actionBlock={<EditSiteAction site={site} text={t("edit")} />}
    >
      <>
        <SiteDetailsClient site={site} />
        <SiteDetailsPreview site={site} />
      </>
    </SitePageLayout>
  );
};

export default SiteDetailsPage;
