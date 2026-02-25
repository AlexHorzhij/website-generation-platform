import { getTranslations } from "next-intl/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { SiteService } from "@/services/site-service";
import { siteKeys } from "@/hooks/use-sites";
import SiteDetailsClient from "./_components/site-details-client";

interface SiteDetailsPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

const SiteDetailsPage = async ({ params }: SiteDetailsPageProps) => {
  const { id } = await params;
  const t = await getTranslations("SiteDetails");
  const queryClient = getQueryClient();

  // Prefetch data on the server
  await queryClient.prefetchQuery({
    queryKey: siteKeys.detail(id),
    queryFn: () => SiteService.getSiteById(id),
  });

  const translations = {
    back_to_sites: t("back_to_sites"),
    total_listings: t("total_listings"),
    autogen_per_day: t("autogen_per_day"),
    site_owner: t("site_owner"),
    region: t("region"),
    site_details: t("site_details"),
    site_id: t("site_id"),
    autogeneration: t("autogeneration"),
    domain: t("domain"),
    images_folder: t("images_folder"),
    status: t("status"),
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SiteDetailsClient id={id} translations={translations} />
    </HydrationBoundary>
  );
};

export default SiteDetailsPage;
