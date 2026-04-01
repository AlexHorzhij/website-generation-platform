"use client";

import { PageLayout } from "@/components/layouts/page-layout";
import { SiteSwitcher } from "./site-switcher";
import { Site } from "@/api/types/site";

interface SitePageLayoutProps {
  site: Site;
  children: React.ReactNode;
  actionBlock?: React.ReactNode;
  description?: string;
  goBackLink?: string;
}

export function SitePageLayout({
  site,
  children,
  actionBlock,
  description,
  goBackLink,
}: SitePageLayoutProps) {
  return (
    <PageLayout
      title={<SiteSwitcher currentSite={site} />}
      actionBlock={actionBlock}
      description={description}
      goBackLink={goBackLink}
    >
      {children}
    </PageLayout>
  );
}
