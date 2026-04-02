"use client";

import { useImages } from "@/api/hooks/use-images";
import { ImageGrid } from "@/components/image-grid";

interface FolderImagesClientProps {
  folderName: string;
}

export default function FolderImagesClient({ folderName }: FolderImagesClientProps) {
  // Using siteId 1 as in global service for now
  const siteId = 1;
  const { data: images = [], isLoading } = useImages(siteId, folderName);

  return (
    <div className="space-y-6">
      <ImageGrid
        images={images}
        isLoading={isLoading}
        onView={(image) => console.log("View", image)}
        onDelete={(image) => console.log("Delete", image)}
      />
    </div>
  );
}
