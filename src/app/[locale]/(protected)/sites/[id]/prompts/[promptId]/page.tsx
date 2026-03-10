import { PageLayout } from "@/components/layouts/page-layout";
import { getTranslations } from "next-intl/server";
import { PromptDetailClient } from "@/app/[locale]/(protected)/prompts/[id]/_components/prompt-detail-client";

interface PromptDetailPageProps {
  params: Promise<{
    locale: string;
    id: string;
    promptId: string;
  }>;
}

const PromptDetailPage = async ({ params }: PromptDetailPageProps) => {
  const { id: siteId, promptId } = await params;
  const t = await getTranslations("PromptsManagement");

  return (
    <PageLayout
      title={`${t("details_title")} #${promptId}`}
      goBackLink={`/sites/${siteId}/prompts`}
    >
      <PromptDetailClient id={Number(promptId)} />
    </PageLayout>
  );
};

export default PromptDetailPage;
