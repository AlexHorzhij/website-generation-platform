import { notFound } from "next/navigation";
import { SiteService } from "@/api/services/site-service";
import { CategoryDetailsClient, CategoryHeaderActions } from "./_components";
import { SitePageLayout } from "../../../_components/site-page-layout";
import { PageLayout } from "@/components/layouts/page-layout";
import { routing } from "@/i18n/routing";

interface CategoryPageProps {
  params: Promise<{
    locale: string;
    id: string;
    categoryId: string;
  }>;
}

export async function generateStaticParams() {
  const sites = await SiteService.getSites();
  const locales = routing.locales;

  const params = await Promise.all(
    sites.map(async (site) => {
      const categories = await SiteService.getSiteCategories(site.id);
      return locales.flatMap((locale) =>
        categories.map((category) => ({
          locale,
          id: String(site.id),
          categoryId: String(category.id),
        })),
      );
    }),
  );

  return params.flat();
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { id, categoryId } = await params;
  const siteId = Number(id);
  const catId = Number(categoryId);

  const site = await SiteService.getSiteById(siteId);
  if (!site) return notFound();

  const categories = await SiteService.getSiteCategories(siteId);
  const category = categories.find((c) => c.id === catId);

  if (!site || !category) {
    return notFound();
  }

  return (
    <PageLayout
      title={category.name}
      goBackLink={`/sites/${siteId}/categories`}
      actionBlock={
        <CategoryHeaderActions siteId={siteId} category={category} />
      }
    >
      <CategoryDetailsClient siteId={siteId} category={category} />
    </PageLayout>
  );
};

export default CategoryPage;
