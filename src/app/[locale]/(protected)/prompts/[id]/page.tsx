import { PageLayout } from "@/components/layouts/page-layout";
import { getTranslations } from "next-intl/server";
import { PromptDetailClient } from "./_components/prompt-detail-client";

interface PromptDetailPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

const PromptDetailPage = async ({ params }: PromptDetailPageProps) => {
  const { id } = await params;
  const t = await getTranslations("PromptsManagement");

  return (
    <PageLayout title={`${t("details_title")} #${id}`} goBackLink="/prompts">
      <PromptDetailClient id={Number(id)} />
    </PageLayout>
  );
};

export default PromptDetailPage;
