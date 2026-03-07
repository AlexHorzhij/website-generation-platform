import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { SiteService } from "@/api/services/site-service";
import { ListingService } from "@/api/services/listing-service";
import { siteKeys } from "@/api/hooks/use-sites";
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

  const queryClient = getQueryClient();

  // Prefetch data
  await queryClient.prefetchQuery({
    queryKey: [...siteKeys.all, "listings", id],
    queryFn: () => ListingService.getListingsBySiteId(Number(id)),
  });

  return <ListingsClient site={site} />;
};

export default ListingsPage;
