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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateRegion, useSiteRegions } from "@/api/hooks/use-sites";
import { Region } from "@/api/types/site";
import { DialogModal } from "@/components/ui-kit/table/dialog-modal";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  nameEn: z.string().min(2, "English name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  parentId: z.string().optional(),
});

interface CreateRegionDialogProps {
  siteId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRegionDialog({
  siteId,
  open,
  onOpenChange,
}: CreateRegionDialogProps) {
  const t = useTranslations("RegionsManagement");
  const createMutation = useCreateRegion(siteId);
  const { data: regions = [] } = useSiteRegions(siteId);

  const parentRegions = React.useMemo(
    () => regions.filter((r) => !r.parentId),
    [regions],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      nameEn: "",
      code: "",
      parentId: "0",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const parentId = Number(values.parentId || 0);
    const parent = parentRegions.find((r) => r.id === parentId);

    const newRegion: Region = {
      id: 0,
      name: values.name,
      nameEn: values.nameEn,
      code: values.code,
      siteId: siteId,
      parentId: parentId,
      isParent: parentId === 0,
      parentName: parent?.name || "",
      childrenCount: 0,
      listingsCount: 0,
    };

    createMutation.mutate(newRegion, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
      },
    });
  };

  return (
    <DialogModal
      open={open}
      onOpenChange={onOpenChange}
      onSave={form.handleSubmit(onSubmit)}
      title={t("add_region")}
      isLoading={createMutation.isPending}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("table_name")}</FormLabel>
                  <FormControl>
                    <Input placeholder="Назва (UK)" {...field} />
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
                  <FormLabel>{t("table_name")} (EN)</FormLabel>
                  <FormControl>
                    <Input placeholder="Name (EN)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("table_code")}</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. kyiv" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("table_parent")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">--- ROOT ---</SelectItem>
                      {parentRegions.map((region) => (
                        <SelectItem
                          key={region.id}
                          value={region.id.toString()}
                        >
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </DialogModal>
  );
}
