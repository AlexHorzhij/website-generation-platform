"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/ui/icon";
import { SiteService } from "@/services/site-service";
import { toast } from "sonner";
import { useFolders } from "@/hooks/use-sites";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageFolderType } from "@/types/images";

interface CreateListingFormProps {
  siteId: number;
  locale: string;
  translations: Record<string, string>;
}

export default function CreateListingForm({
  siteId,
  locale,
  translations: t,
}: CreateListingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "1",
    region: "",
    themeId: "1",
    imagePaths: "",
    titleEn: "",
    contact: "",
    folder: "",
  });

  const { data: folders = [] as ImageFolderType[] } = useFolders(
    siteId.toString(),
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        listing: {
          ...formData,
          price: parseFloat(formData.price) || 0,
          categoryId: parseInt(formData.categoryId) || 1,
          themeId: parseInt(formData.themeId) || 1,
        },
        images: formData.imagePaths
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p !== ""),
      };

      await SiteService.createListing(siteId, payload);
      toast.success("Listing created successfully");
      router.push(`/${locale}/sites/${siteId}/listings`);
    } catch (error) {
      toast.error("Failed to create listing");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <Icon icon="heroicons:arrow-left" className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-default-900">{t.title}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{t.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">{t.field_title}</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. iPhone 13 Pro Max"
                />
              </div>

              {/* Title EN */}
              <div className="space-y-2">
                <Label htmlFor="titleEn">{t.field_title_en}</Label>
                <Input
                  id="titleEn"
                  name="titleEn"
                  value={formData.titleEn}
                  onChange={handleChange}
                  placeholder="e.g. iPhone 13 Pro Max - Great Condition"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">{t.field_price}</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="999.99"
                />
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <Label htmlFor="contact">{t.field_contact}</Label>
                <Input
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="john.doe@email.com"
                />
              </div>

              {/* Category ID */}
              <div className="space-y-2">
                <Label htmlFor="categoryId">{t.field_category_id}</Label>
                <Input
                  id="categoryId"
                  name="categoryId"
                  type="number"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Theme ID */}
              <div className="space-y-2">
                <Label htmlFor="themeId">{t.field_theme_id}</Label>
                <Input
                  id="themeId"
                  name="themeId"
                  type="number"
                  value={formData.themeId}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Region */}
              <div className="space-y-2">
                <Label htmlFor="region">{t.field_region}</Label>
                <Input
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  placeholder="California"
                />
              </div>

              {/* Folder */}
              <div className="space-y-2">
                <Label htmlFor="folder">{t.field_images_folder}</Label>
                <Select
                  value={formData.folder}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, folder: value }))
                  }
                >
                  <SelectTrigger id="folder">
                    <SelectValue placeholder={t.select_folder} />
                  </SelectTrigger>
                  <SelectContent>
                    {folders.map((f, i) => (
                      <SelectItem key={i} value={f.name}>
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">{t.field_description}</Label>
              <Textarea
                id="description"
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe your listing..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-default-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                {t.cancel}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : t.save}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
