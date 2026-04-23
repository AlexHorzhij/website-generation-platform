import { PageLayout } from "@/components/layouts/page-layout";
import { getTranslations } from "next-intl/server";
import { PromptDetailClient } from "./_components/prompt-detail-client";
import { routing } from "@/i18n/routing";
import { PromptService } from "@/api/services/prompt-service";

interface PromptDetailPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export async function generateStaticParams() {
  const prompts = await PromptService.getPrompts();
  return routing.locales.flatMap((locale) =>
    prompts.map((prompt) => ({
      locale,
      id: String(prompt.id),
    })),
  );
}

const PromptDetailPage = async ({ params }: PromptDetailPageProps) => {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: "PromptsManagement" });

  return (
    <PageLayout title={`${t("details_title")} #${id}`} goBackLink="/prompts">
      <PromptDetailClient id={Number(id)} />
    </PageLayout>
  );
};

export default PromptDetailPage;
