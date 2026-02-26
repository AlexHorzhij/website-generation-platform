import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SitesTable } from "./_components/sites-table";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { SiteService } from "@/services/site-service";
import { siteKeys } from "@/hooks/use-sites";
import { Link } from "@/components/navigation";

const SitesPage = async () => {
  const t = await getTranslations("SitesManagement");
  const queryClient = getQueryClient();
  console.log("Data in cache:", queryClient.getQueryData(siteKeys.lists()));

  // Prefetch data on the server
  await queryClient.prefetchQuery({
    queryKey: siteKeys.lists(),
    queryFn: () => SiteService.getSites(),
  });

  const translations = {
    site_name: t("table_site_name"),
    domain: t("table_domain"),
    folder: t("table_images_folder"),
    region: t("table_region"),
    owner: t("table_owner"),
    status: t("table_status"),
    actions: t("table_actions"),
    action_view: t("action_view"),
    action_delete: t("action_delete"),
    filter_placeholder: t("filter_placeholder"),
    items_selected: t("items_selected"),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-default-900">
          {t("title")}
        </h2>
        <div className="flex gap-3">
          <Link href="/sites/new">
            <Button color="primary" size="md">
              <Icon icon="heroicons:plus" className="w-4 h-4 me-2" />
              Create New Site
            </Button>
          </Link>
        </div>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <SitesTable translations={translations} />
      </HydrationBoundary>
    </div>
  );
};

export default SitesPage;
