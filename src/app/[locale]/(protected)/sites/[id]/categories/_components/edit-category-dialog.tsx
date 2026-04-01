"use client";

import React from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateCategory } from "@/api/hooks/use-sites";
import { Category } from "@/api/types/site";
import { DialogModal } from "@/components/ui-kit/table/dialog-modal";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nameEn: z.string().min(1, "English name is required"),
  description: z.string().optional().default(""),
  descriptionEn: z.string().optional().default(""),
  seoTitle: z.string().optional().default(""),
  seoDescription: z.string().optional().default(""),
  h1: z.string().optional().default(""),
  text: z.string().optional().default(""),
});

type FormValues = z.infer<typeof formSchema>;

interface EditCategoryDialogProps {
  siteId: number;
  category: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCategoryDialog({
  siteId,
  category,
  open,
  onOpenChange,
}: EditCategoryDialogProps) {
  const t = useTranslations("CategoriesManagement");
  const updateMutation = useUpdateCategory(siteId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
      nameEn: category.nameEn,
      description: category.description,
      descriptionEn: category.descriptionEn,
      seoTitle: category.seoTitle,
      seoDescription: category.seoDescription,
      h1: category.h1,
      text: category.text,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: category.name,
        nameEn: category.nameEn,
        description: category.description,
        descriptionEn: category.descriptionEn,
        seoTitle: category.seoTitle,
        seoDescription: category.seoDescription,
        h1: category.h1,
        text: category.text,
      });
    }
  }, [category, open, form]);

  const onSubmit = (values: FormValues) => {
    updateMutation.mutate(
      {
        id: category.id,
        data: {
          id: category.id,
          ...values,
          siteId,
          description: values.description ?? "",
          descriptionEn: values.descriptionEn ?? "",
          seoTitle: values.seoTitle ?? "",
          seoDescription: values.seoDescription ?? "",
          h1: values.h1 ?? "",
          text: values.text ?? "",
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <DialogModal
      open={open}
      onOpenChange={onOpenChange}
      onSave={() => form.handleSubmit(onSubmit)()}
      title={t("edit_category")}
      isLoading={updateMutation.isPending}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("field_name")}</FormLabel>
                  <FormControl>
                    <Input placeholder="Назва..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nameEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("field_name_en")}</FormLabel>
                  <FormControl>
                    <Input placeholder="Name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("field_description")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Опис..." rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descriptionEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("field_description_en")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="seoTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("field_seo_title")}</FormLabel>
                  <FormControl>
                    <Input placeholder="SEO Title..." {...field} />
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
                    <Input placeholder="H1..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="seoDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("field_seo_description")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="SEO Description..."
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("field_text")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Текст сторінки..."
                    rows={10}
                    {...field}
                  />
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
