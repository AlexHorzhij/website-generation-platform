import { Site } from "@/api/types/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getTranslations } from "next-intl/server";

interface SiteDetailsPreviewProps {
  site: Site;
  locale: string;
}

export async function SiteDetailsPreview({
  site,
  locale,
}: SiteDetailsPreviewProps) {
  const t = await getTranslations({ locale, namespace: "SitesManagement" });

  return (
    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-default-900">
          {t("site_details_preview")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-default-500">
              {t("field_description")}
            </Label>
            <p className="text-default-900 text-sm bg-default-50 p-3 rounded-lg border border-default-100 min-h-[80px]">
              {site.description || "—"}
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-default-500">
              {t("field_description_en")}
            </Label>
            <p className="text-default-900 text-sm bg-default-50 p-3 rounded-lg border border-default-100 min-h-[80px]">
              {site.descriptionEn || "—"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-default-500">
              {t("field_seo_title")}
            </Label>
            <p className="text-default-900 text-sm bg-default-50 p-3 rounded-lg border border-default-100">
              {site.seoTitle || "—"}
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-default-500">
              {t("field_seo_description")}
            </Label>
            <p className="text-default-900 text-sm bg-default-50 p-3 rounded-lg border border-default-100">
              {site.seoDescription || "—"}
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-default-500">
              {t("field_h1")}
            </Label>
            <p className="text-default-900 text-sm bg-default-50 p-3 rounded-lg border border-default-100">
              {site.h1 || "—"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
