"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { ListingService } from "@/api/services/listing-service";
import { toast } from "sonner";
import { siteKeys } from "@/api/hooks/use-sites";
import { useListingMetadata } from "@/api/hooks/use-listings";
import { Upload, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DialogModal } from "@/components/ui-kit/table/dialog-modal";

interface CreateListingFormDialogProps {
  siteId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  categoryId: z.string().min(1, "Category is required"),
  region: z.string().min(1, "Region is required"),
  titleEn: z.string().min(1, "Title (English) is required"),
  contacts: z.string().min(1, "Contacts are required"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  h1: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateListingFormDialog({
  siteId,
  isOpen,
  onOpenChange,
}: CreateListingFormDialogProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("Listings");

  const { data: metadata, isLoading: isLoadingMetadata } =
    useListingMetadata(siteId);
  const regionList = metadata?.regions || [];
  const categoryList = metadata?.categories || [];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      categoryId: "",
      region: "",
      titleEn: "",
      contacts: "",
      seoTitle: "",
      seoDescription: "",
      h1: "",
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: "",
        description: "",
        price: "",
        categoryId: "",
        region: "",
        titleEn: "",
        contacts: "",
        seoTitle: "",
        seoDescription: "",
        h1: "",
      });
      setSelectedFile(null);
      setPreview(null);
    }
  }, [isOpen, form]);

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

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      const listingData = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price) || 0,
        categoryId: parseInt(data.categoryId) || undefined,
        region: data.region,
        titleEn: data.titleEn,
        contacts: data.contacts,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        h1: data.h1,
      };

      await ListingService.createListing(siteId, listingData, selectedFile);
      toast.success(t("success_create") || "Listing created successfully");

      queryClient.invalidateQueries({
        queryKey: [...siteKeys.all, "listings", siteId],
      });
      onOpenChange(false);
    } catch (error) {
      toast.error(t("error_create") || "Failed to create listing");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogModal
      open={isOpen}
      onOpenChange={onOpenChange}
      onSave={() => form.handleSubmit(onSubmit)()}
      title={t("create_listing")}
      isLoading={isLoading}
    >
      <Form {...form}>
        <form className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("field_title")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="titleEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("field_title_en")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("field_price")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contacts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("field_contact")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("field_category")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingMetadata
                              ? "Loading..."
                              : t("select_category")
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryList.length > 0 &&
                        categoryList
                          .filter((cat: any) => cat.id != null)
                          .map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("field_region")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingMetadata
                              ? "Loading..."
                              : t("select_region")
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {!isLoadingMetadata &&
                        regionList.length > 0 &&
                        regionList
                          .filter((r: any) => r.name)
                          .map((r: any) => (
                            <SelectItem key={r.id || r.name} value={r.name}>
                              {r.name}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 col-span-2">
              <Label>{t("field_images")}</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {preview ? (
                  <div className="relative w-20 h-20 group">
                    <Image
                      src={preview}
                      alt="preview"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover rounded-md border border-default-200"
                      unoptimized
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
            <FormField
              control={form.control}
              name="seoTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("field_seo_title")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t("field_seo_title")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="h1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("field_h1")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t("field_h1")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seoDescription"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{t("field_seo_description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t("field_seo_description")}
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("field_description")}</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </DialogModal>
  );
}
