"use client";

import { usePrompt } from "@/api/hooks/use-prompts";
import { useSite } from "@/api/hooks/use-sites";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { EditPromptDialog } from "../../_components/edit-prompt-dialog";
import React from "react";

interface PromptDetailClientProps {
  id: number;
}

export const PromptDetailClient = ({ id }: PromptDetailClientProps) => {
  const { data: prompt, isLoading: isPromptLoading } = usePrompt(id);
  const { data: site, isLoading: isSiteLoading } = useSite(
    prompt?.siteId as number,
  );
  const t = useTranslations("PromptsManagement");
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  if (isPromptLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="text-center py-12 text-default-500">Prompt not found</div>
    );
  }

  const linesCount = prompt.prompt.split("\n").length;
  const charsCount = prompt.prompt.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 border-none shadow-sm bg-white dark:bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-lg font-bold">
              {t("details_title")}
            </CardTitle>
            <div className="flex gap-2">
              {prompt.default && <Badge color="info">Default</Badge>}
              {prompt.customized && <Badge color="warning">Customized</Badge>}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit className="w-4 h-4 mr-2" />
            {t("action_edit")}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-default-400 uppercase tracking-wider">
                {t("field_appointment")}
              </p>
              <p className="text-sm font-semibold text-default-900">
                {prompt.appointment}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-default-400 uppercase tracking-wider">
                {t("field_description")}
              </p>
              <p className="text-sm text-default-700">{prompt.description}</p>
            </div>
            {prompt.siteId ? (
              <>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-default-400 uppercase tracking-wider">
                    {t("field_language")}
                  </p>
                  <p className="text-sm text-default-700">
                    {site?.language || (isSiteLoading ? "Loading..." : "N/A")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-default-400 uppercase tracking-wider">
                    {t("field_site_domain")}
                  </p>
                  <p className="text-sm text-primary font-medium">
                    {site?.domainName || (isSiteLoading ? "Loading..." : "N/A")}
                  </p>
                </div>
              </>
            ) : (
              <div className="sm:col-span-2 py-2 px-3 bg-default-50 rounded-md">
                <p className="text-sm text-default-500 italic">
                  This is a system-wide prompt. Not attached to any specific
                  site.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-4 border-t border-default-100">
            <p className="text-xs font-medium text-default-400 uppercase tracking-wider">
              {t("field_content")}
            </p>
            <div className="bg-default-50 dark:bg-slate-800 p-4 rounded-lg border border-default-200">
              <pre className="text-sm text-default-800 whitespace-pre-wrap font-mono leading-relaxed">
                {prompt.prompt}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-default-500">
              Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-default-50 last:border-0">
              <span className="text-sm text-default-500">
                {t("field_lines")}
              </span>
              <span className="text-sm font-bold text-default-900">
                {linesCount}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-default-50 last:border-0">
              <span className="text-sm text-default-500">
                {t("field_characters")}
              </span>
              <span className="text-sm font-bold text-default-900">
                {charsCount}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <EditPromptDialog
        prompt={prompt}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        siteId={prompt.siteId ?? undefined}
      />
    </div>
  );
};
