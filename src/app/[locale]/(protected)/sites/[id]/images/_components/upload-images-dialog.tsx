"use client";

import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogModal } from "@/components/ui-kit/table/dialog-modal";
import { useImagesFolders, useUploadImage } from "@/api/hooks/use-images";
import { toast } from "sonner";

const formSchema = z.object({
  folderName: z.string().min(1, "Folder name is required"),
  files: z.any(),
});

interface UploadImagesDialogProps {
  siteId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultFolder?: string;
}

export function UploadImagesDialog({
  siteId,
  open,
  onOpenChange,
  defaultFolder,
}: UploadImagesDialogProps) {
  const t = useTranslations("ImagesManagement");
  const uploadMutation = useUploadImage();
  const { data: folders = [] } = useImagesFolders(siteId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      folderName: defaultFolder || "",
      files: null,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        folderName: defaultFolder || "",
        files: null,
      });
    }
  }, [open, defaultFolder, form]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const fileList = values.files as FileList;
    if (!fileList || fileList.length === 0) {
      toast.error(t("select_files"));
      return;
    }

    try {
      for (let i = 0; i < fileList.length; i++) {
        await uploadMutation.mutateAsync({
          siteId,
          folderName: values.folderName,
          file: fileList[i],
        });
      }
      toast.success(t("upload_success"));
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error(t("upload_error"));
    }
  };

  return (
    <DialogModal
      open={open}
      onOpenChange={onOpenChange}
      onSave={form.handleSubmit(onSubmit)}
      title={t("upload_title")}
      isLoading={uploadMutation.isPending}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="folderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("select_folder")}</FormLabel>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("select_folder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {folders.map((folder) => (
                          <SelectItem key={folder.name} value={folder.name}>
                            {folder.name} ({folder.amount})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    placeholder={t("add_folder")}
                    className="w-1/2"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={
                      folders.some((f) => f.name === field.value)
                        ? ""
                        : field.value
                    }
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="files"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>{t("select_files")}</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(event) => {
                      onChange(event.target.files);
                    }}
                    {...fieldProps}
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
