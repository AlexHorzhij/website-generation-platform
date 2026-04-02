import { getTranslations } from "next-intl/server";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ImageService } from "@/api/services/image-service";
import { imageKeys } from "@/api/hooks/use-images";
import { PageLayout } from "@/app/[locale]/(protected)/sites/_components/page-layout";
import ImagesFoldersClient from "./_components/images-folders-client";

const AllImagesPage = async () => {
  const t = await getTranslations("ImagesManagement");
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: imageKeys.allFolders(),
    queryFn: () => ImageService.getAllFolders(),
  });

  return (
    <PageLayout title={t("title")}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ImagesFoldersClient />
      </HydrationBoundary>
    </PageLayout>
  );
};

export default AllImagesPage;
