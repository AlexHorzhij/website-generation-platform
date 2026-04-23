import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { siteKeys } from "@/api/hooks/use-sites";
import { SiteService } from "@/api/services/site-service";
import { routing } from "@/i18n/routing";

export async function generateStaticParams() {
  const sites = await SiteService.getSites();
  return routing.locales.flatMap((locale) =>
    sites.map((site) => ({
      locale,
      id: String(site.id),
    })),
  );
}

interface SiteLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function SiteLayout({
  children,
  params,
}: SiteLayoutProps) {
  const { id } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: siteKeys.detail(Number(id)),
    queryFn: () => SiteService.getSiteById(Number(id)),
  });

  // Prefetch listing metadata for all pages under /sites/[id]/*
  // await queryClient.prefetchQuery({
  //   queryKey: listingKeys.metadata(id),
  //   queryFn: () => ListingService.getMetadata(id),
  // });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
