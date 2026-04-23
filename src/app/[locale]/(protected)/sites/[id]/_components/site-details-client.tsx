import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import SiteHeaderWidget from "./site-header-widget";
import ListingAnalytics from "./listing-analytics";
import { Loader2 } from "lucide-react";
import { Site } from "@/api/types/site";
import { ListingService } from "@/api/services/listing-service";
import { getTranslations } from "next-intl/server";

interface SiteDetailsClientProps {
  site: Site;
  locale: string;
}

const SiteDetailsClient = async ({ site, locale }: SiteDetailsClientProps) => {
  // const { data: listings, isLoading: isListingsLoading } = useListings(
  //   Number(site.id),
  // );
  const listings = await ListingService.getListingsBySiteId(Number(site.id));
  const t = await getTranslations({ locale, namespace: "SiteDetails" });

  // if (isListingsLoading) {
  //   return (
  //     <div className="p-8 text-center text-default-500 font-medium">
  //       Loading site details...
  //     </div>
  //   );
  // }

  if (!site) {
    return (
      <div className="p-8 text-center text-destructive font-bold">
        Site not found
      </div>
    );
  }

  return (
    <>
      {/* New Header Widget */}
      <SiteHeaderWidget site={site} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <ListingAnalytics siteId={Number(site.id)} />
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
                {t("site_details")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <DetailItem
                label={t("total_listings")}
                value={listings?.length}
              />
              <DetailItem
                label={t("autogeneration")}
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
                label={t("autogen_per_day")}
                value={site.autogenPerDay}
              />
              <DetailItem
                label={t("images_folder")}
                value={site.folder}
                className="text-primary font-mono"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
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
