import { notFound } from "next/navigation";
import { SiteService } from "@/api/services/site-service";
import { PageLayout } from "@/components/layouts/page-layout";
import { getTranslations } from "next-intl/server";
import { CategorySeoClient } from "../_components/category-seo-client";

interface CategorySeoPageProps {
  params: Promise<{
    locale: string;
    id: string;
    categoryId: string;
  }>;
}

const CategorySeoPage = async ({ params }: CategorySeoPageProps) => {
  const { id, categoryId, locale } = await params;
  const siteId = Number(id);
  const catId = Number(categoryId);

  const t = await getTranslations({ locale, namespace: "CategoriesManagement" });

  const site = await SiteService.getSiteById(siteId);
  if (!site) return notFound();

  const categories = await SiteService.getSiteCategories(siteId);
  const category = categories.find((c) => c.id === catId);

  if (!category) {
    return notFound();
  }

  const seoInfo = await SiteService.getCategorySeoInfo(catId);

  return (
    <PageLayout
      title={`${t("action_view_seo")}: ${category.name}`}
      goBackLink={`/sites/${siteId}/categories`}
    >
      <CategorySeoClient seoInfo={seoInfo} locale={locale} />
    </PageLayout>
  );
};

export default CategorySeoPage;
