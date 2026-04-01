import { RegionsListClient } from "./_components/regions-list-client";
import { RegionsHeaderActions } from "./_components/regions-header-actions";
import { RegionsStats } from "./_components/regions-stats";
import { SitePageLayout } from "../../_components/site-page-layout";
import { SiteService } from "@/api/services/site-service";

interface SiteRegionsPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

const SiteRegionsPage = async ({ params }: SiteRegionsPageProps) => {
  const { id } = await params;
  const siteId = Number(id);
  const site = await SiteService.getSiteById(siteId);

  if (!site) return <div>Site not found</div>;

  return (
    <SitePageLayout
      site={site}
      actionBlock={<RegionsHeaderActions siteId={siteId} />}
    >
      <div className="space-y-6">
        <RegionsStats siteId={siteId} />
        <RegionsListClient siteId={siteId} />
      </div>
    </SitePageLayout>
  );
};

export default SiteRegionsPage;
