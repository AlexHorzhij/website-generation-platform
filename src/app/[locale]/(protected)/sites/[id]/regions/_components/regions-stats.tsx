"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useSite, useSiteRegions } from "@/api/hooks/use-sites";
import { ActionBlock } from "@/components/blocks/action-block";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Region } from "@/api/types/site";

interface RegionsStatsProps {
  siteId: number;
}

export function RegionsStats({ siteId }: RegionsStatsProps) {
  const t = useTranslations("RegionsManagement");
  const { data: site } = useSite(siteId);
  const { data: regions = [] } = useSiteRegions(siteId);

  const groupedRegions = React.useMemo(() => {
    const parents: Region[] = [];
    regions.forEach((region) => {
      if (!region.parentId) {
        parents.push(region);
      }
    });
    return { parents };
  }, [regions]);

  if (!site && regions.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <ActionBlock
        title={t("stats_root_region")}
        value={site?.region}
        icon={<Icon icon="heroicons:globe-americas" className="w-6 h-6" />}
        action={
          <Badge
            color="info"
            className="text-[10px] h-4 px-1 font-normal opacity-70"
          >
            ROOT
          </Badge>
        }
      />
      <ActionBlock
        title={t("stats_parent_regions")}
        value={groupedRegions.parents.length.toString()}
        icon={<Icon icon="heroicons:map-pin" className="w-6 h-6" />}
        iconWrapperClass="bg-blue-500/10 text-blue-500"
      />
      <ActionBlock
        title={t("stats_sub_regions")}
        value={(regions.length - groupedRegions.parents.length).toString()}
        icon={<Icon icon="heroicons:map" className="w-6 h-6" />}
        iconWrapperClass="bg-emerald-500/10 text-emerald-500"
      />
    </div>
  );
}
