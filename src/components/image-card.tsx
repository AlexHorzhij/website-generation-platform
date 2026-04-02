"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ImageType } from "@/api/types/images";

interface ImageCardProps {
  image: ImageType;
  index: number;
  onView?: (image: any) => void;
  onDelete?: (image: any) => void;
  className?: string;
}

export function ImageCard({
  image,
  index,
  onView,
  onDelete,
  className,
}: ImageCardProps) {
  return (
    <Card
      className={cn(
        "group relative aspect-square overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 bg-default-50",
        className,
      )}
    >
      <Image
        src={image.s3Url}
        alt={image.fileName || `Image ${index}`}
        fill
        unoptimized
        className="object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        {onView && (
          <Button
            size="icon"
            color="secondary"
            className="h-8 w-8"
            onClick={() => onView(image)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            size="icon"
            color="destructive"
            className="h-8 w-8"
            onClick={() => onDelete(image)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}
