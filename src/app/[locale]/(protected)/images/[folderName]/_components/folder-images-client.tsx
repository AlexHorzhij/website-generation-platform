"use client";

import { useImages, useDeleteImage } from "@/api/hooks/use-images";
import { ImageGrid } from "@/components/image-grid";
import { useState } from "react";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface FolderImagesClientProps {
  folderName: string;
}

export default function FolderImagesClient({
  folderName,
}: FolderImagesClientProps) {
  const t = useTranslations("ImagesManagement");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<any>(null);

  // Using siteId 1 as in global service for now
  const siteId = 1;
  const { data: images = [], isLoading } = useImages(siteId, folderName);
  const deleteMutation = useDeleteImage();

  const handleView = (image: any) => {
    if (image.s3Url) {
      window.open(image.s3Url, "_blank");
    }
  };

  const handleDeleteRequest = (image: any) => {
    setImageToDelete(image);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (imageToDelete?.id) {
      deleteMutation.mutate(
        { imageId: imageToDelete.id },
        {
          onSuccess: () => {
            setIsDeleteDialogOpen(false);
            setImageToDelete(null);
            toast.success(t("delete_image_success"));
          },
        },
      );
    }
  };

  return (
    <div className="space-y-6">
      <ImageGrid
        images={images}
        isLoading={isLoading}
        onView={handleView}
        onDelete={handleDeleteRequest}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
        title={t("delete_image_title")}
        description={t("delete_image_description")}
      />
    </div>
  );
}

