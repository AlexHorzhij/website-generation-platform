"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@/api/types/site";
import { Separator } from "@/components/ui/separator";

interface CategoryDetailsClientProps {
  siteId: number;
  category: Category;
}

export function CategoryDetailsClient({ category }: CategoryDetailsClientProps) {
  const t = useTranslations("CategoriesManagement");

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader className="py-6 px-6">
          <CardTitle className="text-xl font-bold text-default-900">
            {t("category_details") || "Category Information"}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-1">
              <p className="text-xs font-bold text-default-400 uppercase tracking-wider">
                ID
              </p>
              <p className="text-sm font-medium text-default-900">
                {category.id}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-default-400 uppercase tracking-wider">
                {t("field_name")}
              </p>
              <p className="text-sm font-medium text-default-900">
                {category.name || "—"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-default-400 uppercase tracking-wider">
                {t("field_name_en")}
              </p>
              <p className="text-sm font-medium text-default-900">
                {category.nameEn || "—"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-default-400 uppercase tracking-wider">
                {t("field_h1")}
              </p>
              <p className="text-sm font-medium text-default-900">
                {category.h1 || "—"}
              </p>
            </div>

            <div className="col-span-full py-2">
               <Separator className="bg-default-100" />
            </div>

            <div className="col-span-full space-y-1">
              <p className="text-xs font-bold text-default-400 uppercase tracking-wider">
                {t("field_description")}
              </p>
              <p className="text-sm font-medium text-default-700 leading-relaxed max-w-4xl">
                {category.description || "—"}
              </p>
            </div>

            <div className="col-span-full space-y-1">
              <p className="text-xs font-bold text-default-400 uppercase tracking-wider">
                {t("field_description_en")}
              </p>
              <p className="text-sm font-medium text-default-700 leading-relaxed max-w-4xl">
                {category.descriptionEn || "—"}
              </p>
            </div>

            <div className="col-span-full py-2">
               <Separator className="bg-default-100" />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-default-400 uppercase tracking-wider">
                {t("field_seo_title")}
              </p>
              <p className="text-sm font-medium text-default-700">
                {category.seoTitle || "—"}
              </p>
            </div>

            <div className="space-y-1">
               <p className="text-xs font-bold text-default-400 uppercase tracking-wider">
                {t("field_seo_description")}
              </p>
              <p className="text-sm font-medium text-default-700 leading-relaxed max-w-2xl">
                {category.seoDescription || "—"}
              </p>
            </div>

             <div className="col-span-full py-2">
               <Separator className="bg-default-100" />
            </div>

            <div className="col-span-full space-y-1">
              <p className="text-xs font-bold text-default-400 uppercase tracking-wider">
                {t("field_text")}
              </p>
              <div className="text-sm font-medium text-default-700 leading-relaxed max-w-4xl p-4 bg-default-50 rounded-lg border border-default-100">
                {category.text || "—"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
