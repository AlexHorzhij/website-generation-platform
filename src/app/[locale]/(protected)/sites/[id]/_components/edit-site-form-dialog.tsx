"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SiteService } from "@/api/services/site-service";
import { toast } from "sonner";
import { siteKeys } from "@/api/hooks/use-sites";
import { useQueryClient } from "@tanstack/react-query";
import { Site, UpdateSiteRequest } from "@/api/types/site";
import { useTranslations } from "next-intl";
import { DialogModal } from "@/components/ui-kit/table/dialog-modal";

interface EditSiteFormDialogProps {
  site: Site;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSiteFormDialog({
  site,
  isOpen,
  onOpenChange,
}: EditSiteFormDialogProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("SitesManagement");

  const [formData, setFormData] = useState({
    siteName: "",
    description: "",
    siteNameEn: "",
    descriptionEn: "",
    currency: "",
    seoTitle: "",
    seoDescription: "",
    h1: "",
  });

  useEffect(() => {
    if (isOpen && site) {
      setFormData({
        siteName: site.marketplaceName || "",
        description: site.description || "",
        siteNameEn: site.marketplaceNameEn || "",
        descriptionEn: site.descriptionEn || "",
        currency: site.currency || "",
        seoTitle: site.seoTitle || "",
        seoDescription: site.seoDescription || "",
        h1: site.h1 || "",
      });
    }
  }, [isOpen, site]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const updatePayload: UpdateSiteRequest = {
        siteName: formData.siteName,
        description: formData.description,
        siteNameEn: formData.siteNameEn,
        descriptionEn: formData.descriptionEn,
        currency: formData.currency,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        h1: formData.h1,
      };

      await SiteService.updateSite(site.id, updatePayload);
      toast.success("Site updated successfully");

      queryClient.invalidateQueries({
        queryKey: siteKeys.all,
      });
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update site");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogModal
      open={isOpen}
      onOpenChange={onOpenChange}
      onSave={handleSubmit}
      title={t("edit_site")}
      isLoading={isLoading}
    >
      <form className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">{t("field_site_name")}</Label>
            <Input
              id="siteName"
              name="siteName"
              value={formData.siteName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteNameEn">{t("field_site_name_en")}</Label>
            <Input
              id="siteNameEn"
              name="siteNameEn"
              value={formData.siteNameEn}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">{t("field_currency")}</Label>
            <Input
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoTitle">{t("field_seo_title")}</Label>
            <Input
              id="seoTitle"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
              placeholder={t("field_seo_title")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="h1">{t("field_h1")}</Label>
            <Input
              id="h1"
              name="h1"
              value={formData.h1}
              onChange={handleChange}
              placeholder={t("field_h1")}
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="seoDescription">{t("field_seo_description")}</Label>
            <Textarea
              id="seoDescription"
              name="seoDescription"
              value={formData.seoDescription}
              onChange={handleChange}
              placeholder={t("field_seo_description")}
              rows={2}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">{t("field_description")}</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descriptionEn">{t("field_description_en")}</Label>
          <Textarea
            id="descriptionEn"
            name="descriptionEn"
            rows={4}
            value={formData.descriptionEn}
            onChange={handleChange}
          />
        </div>
      </form>
    </DialogModal>
  );
}
