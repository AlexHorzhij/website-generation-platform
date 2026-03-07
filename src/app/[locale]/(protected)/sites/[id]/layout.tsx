import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";

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
