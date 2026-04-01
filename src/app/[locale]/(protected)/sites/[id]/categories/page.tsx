import { CategoriesListClient } from "./_components/categories-list-client";
import { CategoriesHeaderActions } from "./_components/categories-header-actions";
import { SitePageLayout } from "../../_components/site-page-layout";
import { SiteService } from "@/api/services/site-service";

interface SiteCategoriesPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

const SiteCategoriesPage = async ({ params }: SiteCategoriesPageProps) => {
  const { id } = await params;
  const siteId = Number(id);
  const site = await SiteService.getSiteById(siteId);

  if (!site) return <div>Site not found</div>;

  return (
    <SitePageLayout
      site={site}
      actionBlock={<CategoriesHeaderActions siteId={siteId} />}
    >
      <div className="space-y-6">
        <CategoriesListClient siteId={siteId} />
      </div>
    </SitePageLayout>
  );
};

export default SiteCategoriesPage;
