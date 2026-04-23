import { getTranslations } from "next-intl/server";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ImageService } from "@/api/services/image-service";
import { imageKeys } from "@/api/hooks/use-images";
import { PageLayout } from "@/app/[locale]/(protected)/sites/_components/page-layout";
import ImagesFoldersClient from "./_components/images-folders-client";

interface AllImagesPageProps {
  params: Promise<{ locale: string }>;
}

const AllImagesPage = async ({ params }: AllImagesPageProps) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ImagesManagement" });
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
