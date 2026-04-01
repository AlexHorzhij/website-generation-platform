import { notFound } from "next/navigation";
import { SiteService } from "@/api/services/site-service";
import { CategoryDetailsClient, CategoryHeaderActions } from "./_components";
import { SitePageLayout } from "../../../_components/site-page-layout";
import { PageLayout } from "@/components/layouts/page-layout";

interface CategoryPageProps {
  params: Promise<{
    locale: string;
    id: string;
    categoryId: string;
  }>;
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
