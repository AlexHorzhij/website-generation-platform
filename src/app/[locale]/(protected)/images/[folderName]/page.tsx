import { getTranslations } from "next-intl/server";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ImageService } from "@/api/services/image-service";
import { imageKeys } from "@/api/hooks/use-images";
import { PageLayout } from "@/app/[locale]/(protected)/sites/_components/page-layout";
import FolderImagesClient from "./_components/folder-images-client";

interface FolderImagesPageProps {
  params: Promise<{
    locale: string;
    folderName: string;
  }>;
}

const FolderImagesPage = async ({ params }: FolderImagesPageProps) => {
  const { folderName } = await params;
  const t = await getTranslations("ImagesManagement");
  const queryClient = getQueryClient();

  // Using siteId 1 as in global service for now
  const siteId = 1;

  await queryClient.prefetchQuery({
    queryKey: imageKeys.images(siteId, folderName),
    queryFn: () => ImageService.getImages(siteId, folderName),
  });

  return (
    <PageLayout title={folderName} goBackLink="/images">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <FolderImagesClient folderName={folderName} />
      </HydrationBoundary>
    </PageLayout>
  );
};

export default FolderImagesPage;
