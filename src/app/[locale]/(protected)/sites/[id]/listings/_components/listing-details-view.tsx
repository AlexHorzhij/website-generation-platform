"use client";

import { Listing } from "@/api/types/listing";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";

import { useTranslations } from "next-intl";

interface ListingDetailsViewProps {
  listing: Listing;
  currency?: string;
}

export function ListingDetailsView({
  listing,
  currency = "UAH",
}: ListingDetailsViewProps) {
  const t = useTranslations("Listings");
  const details = [
    {
      label: t("field_id"),
      value: listing.id,
      icon: "heroicons:identification",
    },

    {
      label: t("field_status"),
      value: (
        <Badge
          color={listing.status === "ACTIVE" ? "success" : "warning"}
          className="capitalize"
        >
          {listing.status}
        </Badge>
      ),
      icon: "heroicons:check-circle",
    },

    {
      label: t("field_views"),
      value: listing.viewsCount,
      icon: "heroicons:eye",
    },
    {
      label: t("field_theme"),
      value: listing.themeId,
      icon: "heroicons:paint-brush",
    },
    {
      label: t("field_price"),
      value: `${listing.price || "0.00"} ${currency}`,
      icon: "heroicons:currency-dollar",
    },
    {
      label: t("field_created"),
      value: new Date(listing.createdAt).toLocaleString(),
      icon: "heroicons:calendar",
    },
    {
      label: t("field_site"),
      value: listing.siteName,
      icon: "heroicons:globe-alt",
    },
    {
      label: t("field_category"),
      value: listing.categoryName,
      icon: "heroicons:tag",
    },
    {
      label: t("field_region"),
      value: listing.regionName,
      icon: "heroicons:map-pin",
    },
    {
      label: t("field_contact"),
      value: listing.contact,
      icon: "heroicons:envelope",
    },
  ];

  const images =
    listing.imagePaths?.split(",").filter((p: string) => p.trim() !== "") || [];
  console.log("images", images);
  console.log("listing", listing);
  return (
    <div className="space-y-10">
      {/* Header section with Title */}
      <div className="border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-2xl">
        <h3 className="text-2xl font-extrabold text-default-900 leading-tight">
          {listing.title}
        </h3>
        {listing.titleEn && (
          <p className="text-base text-default-500 italic mt-1">
            {listing.titleEn}
          </p>
        )}
      </div>

      {/* Images section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Icon icon="heroicons:photo" className="w-5 h-5 text-default-400" />
          <p className="text-sm font-bold text-default-500 uppercase tracking-widest">
            {t("field_images")}
          </p>
        </div>
        {images.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hidden">
            {images.map((path: string, idx: number) => (
              <div
                key={idx}
                className="relative flex-none w-72 h-48 rounded-2xl overflow-hidden border border-default-200 bg-default-50 shadow-sm group"
              >
                <img
                  src={`https://placehold.co/600x400/f8fafc/64748b?text=Image+${idx + 1}`}
                  alt={`Listing image ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Icon
                    icon="heroicons:magnifying-glass-plus"
                    className="w-8 h-8 text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed border-default-200 bg-default-50/50 text-default-400 gap-3 transition-colors hover:bg-default-50">
            <div className="w-16 h-16 rounded-full bg-default-100 flex items-center justify-center">
              <Icon icon="heroicons:photo" className="w-8 h-8" />
            </div>
            <span className="text-base font-semibold">
              {t("field_no_images")}
            </span>
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
        {details.map((detail, idx) => (
          <div key={idx} className="flex gap-4 items-start">
            <div className="flex-none w-10 h-10 rounded-full bg-default-100 flex items-center justify-center">
              <Icon icon={detail.icon} className="w-5 h-5 text-default-600" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-default-500 uppercase tracking-tight">
                {detail.label}
              </p>
              <div className="text-sm font-bold text-default-900">
                {detail.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Description section */}
      <div className="bg-default-50 rounded-2xl p-5 border border-default-100">
        <p className="text-xs font-bold text-default-500 uppercase tracking-wider mb-3">
          {t("field_description")}
        </p>
        <div className="text-sm text-default-700 leading-relaxed whitespace-pre-wrap">
          {listing.description}
        </div>
      </div>
    </div>
  );
}
