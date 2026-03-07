"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ListingService } from "@/api/services/listing-service";
import { toast } from "sonner";
import { siteKeys } from "@/api/hooks/use-sites";
import { Upload, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Listing } from "@/api/types/listing";
import { useTranslations } from "next-intl";
import { DialogModal } from "@/components/ui-kit/table/dialog-modal";

interface EditListingFormDialogProps {
  siteId: number;
  listing: Listing;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditListingFormDialog({
  siteId,
  listing,
  isOpen,
  onOpenChange,
}: EditListingFormDialogProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("Listings");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    titleEn: "",
    contacts: "",
    seoTitle: "",
    seoDescription: "",
    h1: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && listing) {
      setFormData({
        title: listing.title || "",
        description: listing.description || "",
        price: listing.price?.toString() || "",
        titleEn: listing.titleEn || "",
        contacts: (listing as any).contacts || (listing as any).contact || "",
        seoTitle: listing.seoTitle || "",
        seoDescription: listing.seoDescription || "",
        h1: listing.h1 || "",
      });
      setSelectedFile(null);
      setPreview(null);
    }
  }, [isOpen, listing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);

    try {
      const updatePayload = {
        title: formData.title,
        description: formData.description,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        h1: formData.h1,
        price: parseFloat(formData.price) || 0,
        titleEn: formData.titleEn,
        contacts: formData.contacts,
      };
      console.log("updatePayload", updatePayload);

      await ListingService.updateListing(
        listing.id,
        updatePayload,
        selectedFile,
      );
      toast.success("Listing updated successfully");

      queryClient.invalidateQueries({
        queryKey: [...siteKeys.all, "listings", siteId],
      });
      queryClient.invalidateQueries({ queryKey: ["listing", listing.id] });
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update listing");
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
      title={t("edit_listing")}
      isLoading={isLoading}
    >
      <form className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t("field_title")}</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="titleEn">{t("field_title_en")}</Label>
            <Input
              id="titleEn"
              name="titleEn"
              value={formData.titleEn}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">{t("field_price")}</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contacts">{t("field_contact")}</Label>
            <Input
              id="contacts"
              name="contacts"
              value={formData.contacts}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-4 col-span-2">
            <Label>{t("field_images")}</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {preview ? (
                <div className="relative w-20 h-20 group">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover rounded-md border border-default-200"
                  />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-default-200 rounded-md cursor-pointer hover:border-primary transition-colors">
                  <Upload className="w-5 h-5 text-default-400" />
                  <span className="text-[10px] text-default-500 mt-1">
                    Upload
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
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
      </form>
    </DialogModal>
  );
}
