import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { DomainService } from "@/api/services/domain-service";
import { domainKeys } from "@/api/hooks/use-domains";
import { DomainDashboardClient } from "./_components/domain-dashboard-client";
import { PageLayout } from "@/components/layouts/page-layout";
import { getTranslations } from "next-intl/server";

interface DomainDetailPageProps {
  params: Promise<{
    locale: string;
    domainName: string;
  }>;
}

const DomainDetailPage = async ({ params }: DomainDetailPageProps) => {
  const { domainName } = await params;
  // const decoded = decodeURIComponent(domainName);
  const decoded = "tutorscoach.com";
  console.log("decoded", decoded);
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: domainKeys.dashboard(decoded),
    queryFn: () => DomainService.getDomainDashboard(decoded),
  });

  const data = await queryClient.fetchQuery({
    queryKey: domainKeys.dashboard(decoded),
    queryFn: () => DomainService.getDomainDashboard(decoded),
  });

  const t = await getTranslations("DomainDetails");
  const pageTitle = `${t("mode_label")}:${data?.mode}`;

  return (
    <PageLayout title={decoded} goBackLink="/domains" description={pageTitle}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DomainDashboardClient data={data} />
      </HydrationBoundary>
    </PageLayout>
  );
};

export default DomainDetailPage;
