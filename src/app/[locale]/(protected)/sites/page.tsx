import { getTranslations } from "next-intl/server";
import { SitesTable } from "./_components/sites-table";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { SiteService } from "@/api/services/site-service";
import { siteKeys } from "@/api/hooks/use-sites";
import { PageLayout } from "./_components/page-layout";
import { ActionBtn } from "@/components/ui-kit/table/action-btn";

const SitesPage = async () => {
  const t = await getTranslations("SitesManagement");
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: siteKeys.lists(),
    queryFn: () => SiteService.getSites(),
  });

  return (
    <PageLayout
      title={t("title")}
      actionBlock={<ActionBtn text=" Create New Site" href="/sites/new" />}
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SitesTable />
      </HydrationBoundary>
    </PageLayout>
  );
};

export default SitesPage;
