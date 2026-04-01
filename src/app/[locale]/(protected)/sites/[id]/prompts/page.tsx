import { PromptsTable } from "@/app/[locale]/(protected)/prompts/_components/prompts-table";
import { SitePageLayout } from "../../_components/site-page-layout";
import { SiteService } from "@/api/services/site-service";

interface SitePromptsPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

const SitePromptsPage = async ({ params }: SitePromptsPageProps) => {
  const { id } = await params;
  const site = await SiteService.getSiteById(Number(id));

  if (!site) return <div>Site not found</div>;

  return (
    <SitePageLayout site={site}>
      <PromptsTable siteId={Number(id)} />
    </SitePageLayout>
  );
};

export default SitePromptsPage;
