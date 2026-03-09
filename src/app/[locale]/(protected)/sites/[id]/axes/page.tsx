import { AxesListClient } from "./_components/axes-list-client";
import { AxesHeaderActions } from "./_components/axes-header-actions";
import { PageLayout } from "@/components/layouts/page-layout";
import { getTranslations } from "next-intl/server";
import { getSitePageTitle } from "../../_helpers/getSitePageTitle";

interface SiteAxesPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

const SiteAxesPage = async ({ params }: SiteAxesPageProps) => {
  const { id } = await params;
  const t = await getTranslations("AxesManagement");
  const siteTitle = await getSitePageTitle(Number(id));

  return (
    <PageLayout
      title={siteTitle}
      actionBlock={<AxesHeaderActions siteId={Number(id)} />}
    >
      <AxesListClient siteId={Number(id)} />
    </PageLayout>
  );
};

export default SiteAxesPage;
