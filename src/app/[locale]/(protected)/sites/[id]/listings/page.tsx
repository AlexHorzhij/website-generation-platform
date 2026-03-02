import { getTranslations } from "next-intl/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { SiteService } from "@/services/site-service";
import { siteKeys } from "@/hooks/use-sites";
import ListingsClient from "./_components/listings-client";
import { notFound } from "next/navigation";

interface ListingsPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

const ListingsPage = async ({ params }: ListingsPageProps) => {
  const { id } = await params;
  const site = await SiteService.getSiteById(Number(id));

  if (!site) {
    notFound();
  }

  const t = await getTranslations("Listings");

  const st = await getTranslations("SiteDetails");
  const queryClient = getQueryClient();

  // Prefetch data
  await queryClient.prefetchQuery({
    queryKey: [...siteKeys.all, "listings", id],
    queryFn: () => SiteService.getListingsBySiteId(id),
  });

  const translations = {
    title: t("title"),
    table_title: t("table_title"),
    table_price: t("table_price"),
    table_category: t("table_category"),
    table_status: t("table_status"),
    table_views: t("table_views"),
    table_date: t("table_date"),
    stats_total: t("stats_total"),
    stats_autogeneration: t("stats_autogeneration"),
    stats_autogen_per_day: t("stats_autogen_per_day"),
    stats_images_folder: t("stats_images_folder"),
    back_to_site: st("back_to_sites"),
    actions: t("actions"),
    action_view: t("action_view"),
    action_delete: t("action_delete"),
    field_id: t("field_id"),
    field_title: t("field_title"),
    field_description: t("field_description"),
    field_price: t("field_price"),
    field_status: t("field_status"),
    field_created: t("field_created"),
    field_views: t("field_views"),
    field_username: t("field_username"),
    field_site: t("field_site"),
    field_category: t("field_category"),
    field_region: t("field_region"),
    field_contact: t("field_contact"),
    field_theme: t("field_theme"),
    field_images: t("field_images"),
    field_no_images: t("field_no_images"),
    details_title: t("details_title"),
    create_listing: t("create_listing"),
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListingsClient site={site} translations={translations} />
    </HydrationBoundary>
  );
};

export default ListingsPage;
