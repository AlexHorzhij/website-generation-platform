"use client";

import React from "react";
import { CategorySeoInfo } from "@/api/types/site";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategorySeoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  info: CategorySeoInfo | null;
  translations: {
    details: string;
    field_seo_title: string;
    field_h1: string;
    field_description: string;
    field_text: string;
  };
}

export function CategorySeoDialog({
  open,
  onOpenChange,
  info,
  translations: t,
}: CategorySeoDialogProps) {
  if (!info) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 bg-default-50 border-b border-default-100">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <span className="text-default-400 capitalize">
              {info.region} -
            </span>
            <span>{t.details}</span>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="p-6 max-h-[calc(85vh-100px)]">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold uppercase text-default-400 mb-1">
                  {t.field_seo_title}
                </h4>
                <p className="text-sm font-medium text-default-900">
                  {info.seoTitle || "—"}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase text-default-400 mb-1">
                  {t.field_h1}
                </h4>
                <p className="text-sm font-medium text-default-900">
                  {info.h1 || "—"}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-default-400 mb-1">
                {t.field_description}
              </h4>
              <div className="text-sm text-default-600 bg-default-50 p-4 rounded-xl leading-relaxed whitespace-pre-wrap">
                {info.seoDescription || "—"}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-default-400 mb-1">
                {t.field_text}
              </h4>
              <div className="text-sm text-default-600 bg-default-50 p-4 rounded-xl leading-relaxed whitespace-pre-wrap">
                {info.text || "—"}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
