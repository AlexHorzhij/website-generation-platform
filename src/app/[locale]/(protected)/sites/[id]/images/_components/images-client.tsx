"use client";

import { useImages, useDeleteImage } from "@/api/hooks/use-images";
import { Site } from "@/api/types/site";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageGrid } from "@/components/image-grid";
import { toast } from "sonner";

interface ImagesClientProps {
  site: Site;
  folderName?: string;
}

export default function ImagesClient({ site, folderName }: ImagesClientProps) {
  const { id } = useParams();
  const siteId = Number(id);
  const t = useTranslations("ImagesManagement");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<any>(null);

  const { data: images = [], isLoading } = useImages(siteId, folderName || "");
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
        }
      );
    }
  };

  if (!folderName) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-default-400 bg-white rounded-xl shadow-sm border border-default-100">
        <Icon icon="heroicons:folder-open" className="w-16 h-16 opacity-20" />
        <p className="text-xl font-medium">{t("no_folder_selected")}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-default-400 bg-white rounded-xl shadow-sm border border-default-100">
        <Icon icon="heroicons:photo" className="w-16 h-16 opacity-20" />
        <p className="text-xl font-medium">{t("no_images_found")}</p>
      </div>
    );
  }

  return (
    <>
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
    </>
  );
}

