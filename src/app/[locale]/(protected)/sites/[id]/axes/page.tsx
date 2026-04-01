import { AxesListClient } from "./_components/axes-list-client";
import { AxesHeaderActions } from "./_components/axes-header-actions";
import { SitePageLayout } from "../../_components/site-page-layout";
import { SiteService } from "@/api/services/site-service";

interface SiteAxesPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

const SiteAxesPage = async ({ params }: SiteAxesPageProps) => {
  const { id } = await params;
  const site = await SiteService.getSiteById(Number(id));

  if (!site) return <div>Site not found</div>;

  return (
    <SitePageLayout
      site={site}
      actionBlock={<AxesHeaderActions siteId={Number(id)} />}
    >
      <AxesListClient siteId={Number(id)} />
    </SitePageLayout>
  );
};

export default SiteAxesPage;
