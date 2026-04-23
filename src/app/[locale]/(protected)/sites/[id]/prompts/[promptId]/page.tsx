import { PageLayout } from "@/components/layouts/page-layout";
import { getTranslations } from "next-intl/server";
import { PromptDetailClient } from "@/app/[locale]/(protected)/prompts/[id]/_components/prompt-detail-client";
import { routing } from "@/i18n/routing";
import { SiteService } from "@/api/services/site-service";
import { PromptService } from "@/api/services/prompt-service";

interface PromptDetailPageProps {
  params: Promise<{
    locale: string;
    id: string;
    promptId: string;
  }>;
}

export async function generateStaticParams() {
  const sites = await SiteService.getSites();
  const locales = routing.locales;

  const params = await Promise.all(
    sites.map(async (site) => {
      const prompts = await PromptService.getSitePrompts(site.id);
      return locales.flatMap((locale) =>
        prompts.map((prompt) => ({
          locale,
          id: String(site.id),
          promptId: String(prompt.id),
        })),
      );
    }),
  );

  return params.flat();
}

const PromptDetailPage = async ({ params }: PromptDetailPageProps) => {
  const { id: siteId, promptId, locale } = await params;
  const t = await getTranslations({ locale, namespace: "PromptsManagement" });

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
