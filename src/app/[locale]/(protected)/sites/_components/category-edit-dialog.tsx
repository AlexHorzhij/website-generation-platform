"use client";

import { useFormContext } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { type SiteFormValues } from "@/lib/validations/site";
import { DialogModal } from "@/components/ui-kit/table/dialog-modal";

interface CategoryEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export const CategoryEditDialog = ({
  open,
  onOpenChange,
  onSave,
}: CategoryEditDialogProps) => {
  const { control } = useFormContext<SiteFormValues>();

  return (
    <DialogModal
      open={open}
      onOpenChange={onOpenChange}
      onSave={onSave}
      title={"Edit Category"}
    >
      <div className="space-y-4 py-4">
        <FormField
          control={control}
          name="draftCategory.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Electronics" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="draftCategory.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Gadgets and devices"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </DialogModal>
  );
};
