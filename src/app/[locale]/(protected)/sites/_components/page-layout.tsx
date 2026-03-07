"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export const PageLayout = ({
  children,
  title,
  actionBlock,
  goBackLink,
  description,
}: {
  children: React.ReactNode;
  title: string;
  actionBlock?: React.ReactNode;
  goBackLink?: string;
  description?: string;
}) => {
  const t = useTranslations();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {goBackLink && (
            <Button variant="outline" size="md" asChild>
              <Link href={goBackLink}>
                <Icon icon="heroicons:arrow-left" className="w-6 h-6 mr-2" />
                {t("Menu.action_back_to_list")}
              </Link>
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-semibold text-default-900">
              {goBackLink ? `${t("General.site")}: ` : ""}
              {title}
            </h2>
            {description && (
              <p className="text-sm text-default-500">{description}</p>
            )}
          </div>
        </div>
        {actionBlock}
      </div>

      {children}
    </div>
  );
};
