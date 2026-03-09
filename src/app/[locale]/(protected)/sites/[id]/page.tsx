import { getQueryClient } from "@/lib/get-query-client";
import { SiteService } from "@/api/services/site-service";
import { siteKeys } from "@/api/hooks/use-sites";
import SiteDetailsClient from "./_components/site-details-client";
import { SiteDetailsPreview } from "../_components/site-details-preview";
import { PageLayout } from "@/components/layouts/page-layout";
import { EditSiteAction } from "./_components/edit-site-action";
import { getTranslations } from "next-intl/server";

interface SiteDetailsPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

const SiteDetailsPage = async ({ params }: SiteDetailsPageProps) => {
  const { id } = await params;
  const queryClient = getQueryClient();
  const t = await getTranslations("General");

  // Prefetch data on the server
  // await queryClient.prefetchQuery({
  //   queryKey: siteKeys.detail(Number(id)),
  //   queryFn: () => SiteService.getSiteById(Number(id)),
  // });

  const site = await SiteService.getSiteById(Number(id));
  console.log(site);
  const pageTitle = `${site?.marketplaceName} | ${site?.domainName}`;

  if (!site) {
    return <div>Site not found</div>;
  }

  return (
    <PageLayout
      title={pageTitle}
      actionBlock={<EditSiteAction site={site} text={t("edit")} />}
    >
      <SiteDetailsClient site={site} />
      <SiteDetailsPreview site={site} />
    </PageLayout>
  );
};

export default SiteDetailsPage;
