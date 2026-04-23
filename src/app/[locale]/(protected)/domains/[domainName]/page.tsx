import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { DomainService } from "@/api/services/domain-service";
import { domainKeys } from "@/api/hooks/use-domains";
import { DomainDashboardClient } from "./_components/domain-dashboard-client";
import { PageLayout } from "@/components/layouts/page-layout";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export async function generateStaticParams() {
  const domains = await DomainService.getDomains();
  return routing.locales.flatMap((locale) =>
    domains.map((domain) => ({
      locale,
      domainName: domain.domainName,
    })),
  );
}

interface DomainDetailPageProps {
  params: Promise<{
    locale: string;
    domainName: string;
  }>;
}

const DomainDetailPage = async ({ params }: DomainDetailPageProps) => {
  const { domainName, locale } = await params;
  const decoded = decodeURIComponent(domainName);
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: domainKeys.dashboard(decoded),
    queryFn: () => DomainService.getDomainDashboard(decoded),
  });

  const data = await queryClient.fetchQuery({
    queryKey: domainKeys.dashboard(decoded),
    queryFn: () => DomainService.getDomainDashboard(decoded),
  });

  const t = await getTranslations({ locale, namespace: "DomainDetails" });
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
