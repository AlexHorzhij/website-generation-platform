import { Site } from "@/types/site";
import { useTranslations } from "next-intl";

export const PageLayout = ({
  children,
  site,
  actionBlock,
}: {
  children: React.ReactNode;
  site: Site;
  actionBlock?: React.ReactNode;
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-default-900">
            {site.marketplaceName}
          </h2>
          <p className="text-sm text-default-500">{site.marketplaceNameEn}</p>
        </div>
        {actionBlock}
      </div>

      {children}
    </div>
  );
};
