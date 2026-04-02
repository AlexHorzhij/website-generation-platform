"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageCard } from "./image-card";

interface ImageGridProps {
  images: any[];
  isLoading?: boolean;
  onView?: (image: any) => void;
  onDelete?: (image: any) => void;
  emptyMessage?: string;
  className?: string;
}

export function ImageGrid({
  images = [],
  isLoading,
  onView,
  onDelete,
  emptyMessage,
  className,
}: ImageGridProps) {
  const t = useTranslations("ImagesManagement");

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
        <p className="text-xl font-medium">
          {emptyMessage || t("no_images_found")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {images.map((image, index) => (
          <ImageCard
            key={image.id || index}
            image={image}
            index={index}
            onView={onView}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
