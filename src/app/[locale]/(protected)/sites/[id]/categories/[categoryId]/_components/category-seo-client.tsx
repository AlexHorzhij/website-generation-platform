import { CategorySeoInfo } from "@/api/types/site";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategorySeoClientRow } from "./category-seo-client-row";
import { getTranslations } from "next-intl/server";

interface CategorySeoClientProps {
  seoInfo: CategorySeoInfo[];
  locale: string;
}

export async function CategorySeoClient({
  seoInfo,
  locale,
}: CategorySeoClientProps) {
  const [t, g] = await Promise.all([
    getTranslations({ locale, namespace: "CategoriesManagement" }),
    getTranslations({ locale, namespace: "General" }),
  ]);

  const translations = {
    details: t("seo_details"),
    field_seo_title: t("field_seo_title"),
    field_h1: t("field_h1"),
    field_description: t("field_description"),
    field_text: t("field_text"),
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="py-6 px-6">
          <CardTitle className="text-xl font-bold text-default-900">
            {t("seo_title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="table-fixed w-full">
            <TableHeader className="bg-default-50 border-y border-default-100">
              <TableRow>
                <TableHead className="px-6 font-bold uppercase text-[11px] h-12 text-default-900 w-[10%]">
                  {g("region")}
                </TableHead>
                <TableHead className="px-6 font-bold uppercase text-[11px] h-12 text-default-900 w-[15%]">
                  {t("field_seo_title")}
                </TableHead>
                <TableHead className="px-6 font-bold uppercase text-[11px] h-12 text-default-900 w-[15%]">
                  {t("field_h1")}
                </TableHead>
                <TableHead className="px-6 font-bold uppercase text-[11px] h-12 text-default-900 w-[30%]">
                  {t("field_description")}
                </TableHead>
                <TableHead className="px-6 font-bold uppercase text-[11px] h-12 text-default-900 w-[30%]">
                  {t("field_text")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seoInfo && seoInfo.length > 0 ? (
                seoInfo.map((info) => (
                  <CategorySeoClientRow
                    key={info.id}
                    info={info}
                    translations={translations}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-default-400 text-sm italic"
                  >
                    {t("no_seo_info")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
