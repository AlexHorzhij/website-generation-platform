import { getQueryClient } from "@/lib/get-query-client";
import { SiteService } from "@/api/services/site-service";
import { ListingService } from "@/api/services/listing-service";
import { siteKeys } from "@/api/hooks/use-sites";
import ListingsClient from "./_components/listings-client";
import { ListingsHeaderActions } from "./_components/listings-header-actions";
import { SitePageLayout } from "../../_components/site-page-layout";
import { notFound } from "next/navigation";

interface ListingsPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

const ListingsPage = async ({ params }: ListingsPageProps) => {
  const { id } = await params;
  const siteId = Number(id);
  const site = await SiteService.getSiteById(siteId);

  if (!site) {
    notFound();
  }

  const queryClient = getQueryClient();

  // Prefetch data
  await queryClient.prefetchQuery({
    queryKey: [...siteKeys.all, "listings", siteId],
    queryFn: () => ListingService.getListingsBySiteId(siteId),
  });

  return (
    <SitePageLayout
      site={site}
      actionBlock={<ListingsHeaderActions siteId={siteId} />}
    >
      <ListingsClient site={site} />
    </SitePageLayout>
  );
};

export default ListingsPage;
