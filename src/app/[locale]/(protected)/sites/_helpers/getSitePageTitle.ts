import { SiteService } from "@/api/services/site-service";

export const getSitePageTitle = async (id: number) => {
  const site = await SiteService.getSiteById(id);
  if (!site) return "Site Not Found";
  return `${site.marketplaceName} | ${site.domainName}`;
};
