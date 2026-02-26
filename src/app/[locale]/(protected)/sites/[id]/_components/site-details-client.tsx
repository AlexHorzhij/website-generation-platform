"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";
import { StatisticsBlock } from "@/components/blocks/statistics-block";
import { StatusBlock } from "@/components/blocks/status-block";
import { cn } from "@/lib/utils";
import { useSite } from "@/hooks/use-sites";
import { useParams } from "next/navigation";
import SiteHeaderWidget from "./site-header-widget";
import ListingAnalytics from "./listing-analytics";

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
  };
}

const SiteDetailsClient = ({ id, translations: t }: SiteDetailsClientProps) => {
  const { data: site, isLoading } = useSite(id);
  const params = useParams();
  const locale = params.locale as string;

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8 px-3 bg-white dark:bg-slate-800"
        >
          <Link href={`/${locale}/sites`}>
            <Icon icon="heroicons:arrow-left" className="w-3.5 h-3.5 mr-2" />
            {t.back_to_sites}
          </Link>
        </Button>
      </div>

      {/* New Header Widget */}
      <SiteHeaderWidget site={site} />

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticsBlock
          title={t.total_listings}
          total="7"
          chartColor="#3b82f6"
          series={[5, 10, 8, 15, 12, 20, 18, 25]}
          className="border-none shadow-sm"
        />
        <StatisticsBlock
          title={t.autogen_per_day}
          total={`${site.autogenPerDay} / day`}
          chartColor="#10b981"
          series={[50, 40, 60, 45, 70, 55, 80, 75]}
          className="border-none shadow-sm"
        />
        <StatusBlock
          title={t.site_owner}
          total={site.owner?.username || "N/A"}
          icon={<Icon icon="heroicons:user-circle" className="w-6 h-6" />}
          chartColor="#f59e0b"
          className="border-none shadow-sm"
        />
        <StatusBlock
          title={t.region}
          total={site.region}
          icon={<Icon icon="heroicons:map-pin" className="w-6 h-6" />}
          chartColor="#8b5cf6"
          className="border-none shadow-sm"
        />
      </div>

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
              <DetailItem label={t.site_id} value={site.id} />
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
                label={t.domain}
                value={
                  <Link
                    href={`https://${site.domainName}`}
                    target="_blank"
                    className="text-primary hover:underline font-medium break-all"
                  >
                    {site.domainName}
                  </Link>
                }
              />
              <DetailItem
                label={t.images_folder}
                value={site.bucketName}
                className="text-primary font-mono"
              />
              <DetailItem
                label={t.status}
                value={
                  <Badge
                    color={site.status === "live" ? "success" : "warning"}
                    className="px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all"
                  >
                    {site.status}
                  </Badge>
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
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
