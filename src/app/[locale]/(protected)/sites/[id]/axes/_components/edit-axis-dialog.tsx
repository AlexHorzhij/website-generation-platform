"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Axis } from "@/api/types/axis";
import { useUpdateAxis } from "@/api/hooks/use-axes";
import { toast } from "sonner";
import { DialogModal } from "@/components/ui-kit/table/dialog-modal";

interface EditAxisDialogProps {
  axis: Axis | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  readOnly?: boolean;
}

export function EditAxisDialog({
  axis,
  open,
  onOpenChange,
  readOnly = false,
}: EditAxisDialogProps) {
  const t = useTranslations("AxesManagement");
  const updateAxis = useUpdateAxis();

  const [type, setType] = React.useState("");
  const [content, setContent] = React.useState("");

  React.useEffect(() => {
    if (axis) {
      setType(axis.type);
      setContent(axis.content);
    }
  }, [axis, open]);

  const handleSave = async () => {
    if (!axis || readOnly) return;

    try {
      await updateAxis.mutateAsync({
        id: axis.id,
        siteId: axis.siteId,
        type,
        content,
      });
      toast.success("Axis updated successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update axis");
    }
  };

  return (
    <DialogModal
      open={open}
      onOpenChange={onOpenChange}
      title={readOnly ? t("list_title") : t("edit_axis")}
      onSave={readOnly ? undefined : handleSave}
      isLoading={updateAxis.isPending}
    >
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="type">{t("field_type")}</Label>
          <Input
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={true}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="axis-content">{t("field_content")}</Label>
          <Textarea
            id="axis-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
            disabled={readOnly}
          />
        </div>
      </div>
    </DialogModal>
  );
}
