import { getTranslations } from "next-intl/server";
import { SiteService } from "@/api/services/site-service";
import { ImageService } from "@/api/services/image-service";
import { siteKeys } from "@/api/hooks/use-sites";
import { imageKeys } from "@/api/hooks/use-images";
import { SitePageLayout } from "../../_components/site-page-layout";
import { notFound } from "next/navigation";
import { getQueryClient } from "@/lib/get-query-client";
import ImagesClient from "./_components/images-client";
import { ImagesHeaderActions } from "./_components/images-header-actions";

interface SiteImagesPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

const SiteImagesPage = async ({ params }: SiteImagesPageProps) => {
  const { id } = await params;
  const siteId = Number(id);
  const site = await SiteService.getSiteById(siteId);

  if (!site) return notFound();

  const queryClient = getQueryClient();

  // Prefetch images for site folder
  if (site.folder) {
    await queryClient.prefetchQuery({
      queryKey: imageKeys.images(siteId, site.folder),
      queryFn: () => ImageService.getImages(siteId, site.folder!),
    });
  }

  return (
    <SitePageLayout
      site={site}
      actionBlock={<ImagesHeaderActions siteId={siteId} folderName={site.folder} />}
    >
      <ImagesClient site={site} folderName={site.folder} />
    </SitePageLayout>
  );
};

export default SiteImagesPage;
