import { PromptsTable } from "@/app/[locale]/(protected)/prompts/_components/prompts-table";
import { PageLayout } from "@/components/layouts/page-layout";
import { getSitePageTitle } from "../../_helpers/getSitePageTitle";

interface SitePromptsPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

const SitePromptsPage = async ({ params }: SitePromptsPageProps) => {
  const { id } = await params;
  const siteTitle = await getSitePageTitle(Number(id));

  return (
    <PageLayout title={siteTitle}>
      <PromptsTable siteId={Number(id)} />
    </PageLayout>
  );
};

export default SitePromptsPage;
