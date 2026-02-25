"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Site } from "@/types/site";
import { cn } from "@/lib/utils";

interface SiteHeaderWidgetProps {
  site: Site;
  className?: string;
}

const SiteHeaderWidget = ({ site, className }: SiteHeaderWidgetProps) => {
  return (
    <Card className={cn("overflow-hidden border-none shadow-sm", className)}>
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row-reverse items-stretch">
          {/* Section 1: Owner Info (ON THE RIGHT) */}
          <div className="flex-none p-6 flex items-center gap-4 bg-primary/5 min-w-[320px] border-l border-default-100">
            <div className="text-right flex-1">
              <div className="text-default-500 text-sm font-medium mb-1">
                Good evening,
              </div>
              <h4 className="text-xl font-bold text-default-900">
                {site.owner?.username || "N/A"}
              </h4>
              <div className="flex items-center justify-end gap-2 mt-1">
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary rounded uppercase">
                  {site.owner?.role || "ADMIN"}
                </span>
                <span className="text-xs text-default-500">
                  {site.owner?.username ? `@${site.owner.username}` : ""}
                </span>
              </div>
            </div>
            <Avatar className="h-16 w-16 border-2 border-white shadow-sm flex-none">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${site.owner?.username || "default"}`}
              />
              <AvatarFallback>
                {(site.owner?.username || "NA").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Section 2, 3, 4 (MOVING LEFT) */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 divide-x divide-x-reverse divide-default-100">
            {/* Language / Status Block (Left-most in the sequence) */}
            <div className="p-6 flex flex-col justify-center">
              <p className="text-xs font-bold text-default-500 uppercase tracking-tight mb-1">
                Language / Status
              </p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-default-900">
                  {site.language || "N/A"}
                </span>
                <span
                  className={cn(
                    "text-[10px] uppercase px-1.5 py-0.5 rounded font-bold",
                    site.status === "creating"
                      ? "bg-warning/20 text-warning"
                      : "bg-success/20 text-success",
                  )}
                >
                  {site.status}
                </span>
              </div>
            </div>

            {/* Subregions / Currency Block */}
            <div className="p-6 flex flex-col justify-center">
              <p className="text-xs font-bold text-default-500 uppercase tracking-tight mb-1">
                Subregion / Currency
              </p>
              <div className="text-lg font-bold text-default-900">
                {site.subregions || "N/A"} / {site.currency || "USD"}
              </div>
            </div>

            {/* Region Block */}
            <div className="p-6 flex flex-col justify-center">
              <p className="text-xs font-bold text-default-500 uppercase tracking-tight mb-1">
                Region
              </p>
              <div className="text-lg font-bold text-default-900">
                {site.region}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteHeaderWidget;
