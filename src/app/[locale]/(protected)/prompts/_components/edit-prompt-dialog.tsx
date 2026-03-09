"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Prompt } from "@/api/types/prompt";
import { useUpdatePrompt, useUpdateSitePrompt } from "@/api/hooks/use-prompts";
import { toast } from "sonner";
import { DialogModal } from "@/components/ui-kit/table/dialog-modal";

interface EditPromptDialogProps {
  prompt: Prompt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteId?: number;
}

export function EditPromptDialog({
  prompt,
  open,
  onOpenChange,
  siteId,
}: EditPromptDialogProps) {
  const t = useTranslations("PromptsManagement");
  const updatePrompt = useUpdatePrompt();
  const updateSitePrompt = useUpdateSitePrompt();

  const isPending = updatePrompt.isPending || updateSitePrompt.isPending;

  const [description, setDescription] = React.useState("");
  const [content, setContent] = React.useState("");

  React.useEffect(() => {
    if (prompt) {
      setDescription(prompt.description);
      setContent(prompt.prompt);
    }
  }, [prompt, open]);

  const handleSave = async () => {
    if (!prompt) return;

    try {
      if (siteId) {
        await updateSitePrompt.mutateAsync({
          siteId,
          promptId: prompt.id,
          data: {
            description,
            prompt: content,
          },
        });
      } else {
        await updatePrompt.mutateAsync({
          id: prompt.id,
          data: {
            description,
            prompt: content,
          },
        });
      }
      toast.success("Prompt updated successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update prompt");
    }
  };

  const linesCount = content.split("\n").length;
  const charsCount = content.length;

  return (
    <DialogModal
      open={open}
      onOpenChange={onOpenChange}
      title={t("edit_prompt")}
      onSave={handleSave}
      isLoading={isPending}
    >
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="description">{t("field_description")}</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="prompt-content">{t("field_content")}</Label>
            <div className="flex gap-4 text-xs text-default-500">
              <span>
                {t("field_lines")}: <strong>{linesCount}</strong>
              </span>
              <span>
                {t("field_characters")}: <strong>{charsCount}</strong>
              </span>
            </div>
          </div>
          <Textarea
            id="prompt-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px] font-mono"
          />
        </div>
      </div>
    </DialogModal>
  );
}
