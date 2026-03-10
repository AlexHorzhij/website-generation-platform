import { PageLayout } from "@/components/layouts/page-layout";
import { getTranslations } from "next-intl/server";
import { getSitePageTitle } from "../../_helpers/getSitePageTitle";
import { ImageIcon } from "lucide-react";

interface SiteImagesPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

const SiteImagesPage = async ({ params }: SiteImagesPageProps) => {
  const { id } = await params;
  const t = await getTranslations("Menu");
  const siteTitle = await getSitePageTitle(Number(id));

  return (
    <PageLayout title={siteTitle}>
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-default-400">
        <ImageIcon className="w-16 h-16 opacity-30" />
        <p className="text-xl font-medium">{t("site_images")}</p>
        <p className="text-sm text-default-300">Coming soon</p>
      </div>
    </PageLayout>
  );
};

export default SiteImagesPage;
