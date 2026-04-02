"use client";

import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { UploadImagesDialog } from "./upload-images-dialog";

interface ImagesHeaderActionsProps {
  siteId: number;
  folderName?: string;
}

export function ImagesHeaderActions({ siteId, folderName }: ImagesHeaderActionsProps) {
  const t = useTranslations("ImagesManagement");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => setIsUploadOpen(true)}
        className="gap-2"
      >
        <Upload className="w-4 h-4" />
        {t("upload_images")}
      </Button>
      <UploadImagesDialog
        siteId={siteId}
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        defaultFolder={folderName}
      />
    </div>
  );
}

