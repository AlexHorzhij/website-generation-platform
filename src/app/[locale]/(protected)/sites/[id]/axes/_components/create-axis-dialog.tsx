"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAxes, useCreateAxis } from "@/api/hooks/use-axes";
import { toast } from "sonner";
import { DialogModal } from "@/components/ui-kit/table/dialog-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateAxisDialogProps {
  siteId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAxisDialog({
  siteId,
  open,
  onOpenChange,
}: CreateAxisDialogProps) {
  const t = useTranslations("AxesManagement");
  const createAxis = useCreateAxis();

  const [type, setType] = React.useState("USP_ANGLE");
  const [content, setContent] = React.useState("");

  const { data: axesTypes = [], isLoading } = useAxes();

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    try {
      await createAxis.mutateAsync({
        id: 0,
        siteId,
        type,
        content,
      });
      toast.success("Axis created successfully");
      setContent("");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to create axis");
    }
  };

  return (
    <DialogModal
      open={open}
      onOpenChange={onOpenChange}
      title={t("add_axis")}
      onSave={handleSave}
      isLoading={createAxis.isPending}
    >
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="create-type">{t("field_type")}</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="create-type">
              <SelectValue placeholder="Select axis type" />
            </SelectTrigger>
            <SelectContent>
              {axesTypes.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="create-axis-content">{t("field_content")}</Label>
          <Textarea
            id="create-axis-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
            placeholder="Enter axis content..."
          />
        </div>
      </div>
    </DialogModal>
  );
}
