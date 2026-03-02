import { getTranslations } from "next-intl/server";
import CreateListingForm from "./_components/create-listing-form";
import { SiteService } from "@/services/site-service";

export default async function CreateListingPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const { id, locale } = params;
  const t = await getTranslations("Listings");
  const st = await getTranslations("SiteDetails");

  const site = await SiteService.getSiteById(Number(id));

  const translations = {
    title: t("create_listing"),
    field_title: t("field_title"),
    field_description: t("field_description"),
    field_price: t("field_price"),
    field_category_id: t("field_category_id"),
    field_region: t("field_region"),
    field_theme_id: t("field_theme_id"),
    field_images: t("field_images"),
    field_title_en: t("field_title_en"),
    field_contact: t("field_contact"),
    field_images_folder: t("field_images_folder"),
    select_folder: t("select_folder"),
    save: t("save"),
    cancel: t("cancel"),
    back_to_listings: t("title"),
  };

  return (
    <div className="p-6">
      <CreateListingForm
        siteId={Number(id)}
        locale={locale}
        translations={translations}
      />
    </div>
  );
}
