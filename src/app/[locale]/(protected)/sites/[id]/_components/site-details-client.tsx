"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";
import { StatisticsBlock } from "@/components/blocks/statistics-block";
import { StatusBlock } from "@/components/blocks/status-block";
import { cn } from "@/lib/utils";
import { useListings, useSite } from "@/hooks/use-sites";
import { useParams } from "next/navigation";
import SiteHeaderWidget from "./site-header-widget";
import ListingAnalytics from "./listing-analytics";
import { Loader2 } from "lucide-react";
import { PageLayout } from "./page-layout";
import { useTranslations } from "next-intl";

interface SiteDetailsClientProps {
  id: string;
  translations: {
    back_to_sites: string;
    total_listings: string;
    autogen_per_day: string;
    site_owner: string;
    region: string;
    site_details: string;
    site_id: string;
    autogeneration: string;
    domain: string;
    images_folder: string;
    status: string;
    view_listings: string;
  };
}

const SiteDetailsClient = ({ id, translations: t }: SiteDetailsClientProps) => {
  const { data: site, isLoading } = useSite(id);
  const { data: listings, isLoading: isListingsLoading } = useListings(id);
  const params = useParams();
  const locale = params.locale as string;
  const generalTranslations = useTranslations("General");

  if (isLoading) {
    return (
      <div className="p-8 text-center text-default-500 font-medium">
        Loading site details...
      </div>
    );
  }

  if (!site) {
    return (
      <div className="p-8 text-center text-destructive font-bold">
        Site not found
      </div>
    );
  }

  return (
    <PageLayout site={site}>
      {/* New Header Widget */}
      <SiteHeaderWidget site={site} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <ListingAnalytics siteId={id} />
        </div>

        {/* Technical Details */}
        <Card className="border-none shadow-sm overflow-hidden h-full">
          <CardHeader className="bg-default-50/50 border-b border-default-100 py-4 px-6">
            <div className="flex items-center gap-2">
              <Icon
                icon="heroicons:information-circle"
                className="w-5 h-5 text-primary"
              />
              <CardTitle className="text-base font-bold text-default-800">
                {t.site_details}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <DetailItem
                label={t.total_listings}
                value={
                  isListingsLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  ) : (
                    listings?.length
                  )
                }
              />
              <DetailItem
                label={t.autogeneration}
                value={
                  <Badge
                    color={site.autogeneration ? "default" : "secondary"}
                    className="uppercase text-[10px] rounded-sm"
                  >
                    {site.autogeneration ? "Enabled" : "Disabled"}
                  </Badge>
                }
              />
              <DetailItem
                label={t.autogen_per_day}
                value={site.autogenPerDay}
              />
              <DetailItem
                label={t.images_folder}
                value={site.folder}
                className="text-primary font-mono"
              />
              {/* <DetailItem
                label={t.status}
                value={
                  <Badge
                    color={site.status === "live" ? "success" : "warning"}
                    className="px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all"
                  >
                    {site.status}
                  </Badge>
                }
              /> */}
            </div>
            <div className="mt-6">
              <Button asChild className="w-full">
                <Link href={`/${locale}/sites/${id}/listings`}>
                  <Icon icon="heroicons:list-bullet" className="w-4 h-4 mr-2" />
                  {t.view_listings}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-2 text-xl text-default-900">
        <div className="flex flex-col">
          <h4 className="text-lg font-semibold">
            {generalTranslations("description")}
          </h4>
          <p>{site.description}</p>
        </div>
        <div className="flex flex-col">
          <h4 className="text-lg font-semibold">
            {generalTranslations("description_en")}
          </h4>
          <p>{site.descriptionEn}</p>
        </div>
      </div>
    </PageLayout>
  );
};

const DetailItem = ({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) => (
  <div className="flex items-center justify-between py-2.5 border-b border-default-100 last:border-0">
    <span className="text-xs font-bold text-default-700 uppercase tracking-tight">
      {label}
    </span>
    <span className={cn("text-sm text-default-600 font-semibold", className)}>
      {value}
    </span>
  </div>
);

export default SiteDetailsClient;
