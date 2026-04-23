import { SiteService } from "@/api/services/site-service";
import { ListingService } from "@/api/services/listing-service";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layouts/page-layout";
import { ListingDetailsView } from "../_components/listing-details-view";
import { EditListingBtn } from "../_components/edit-listing-btn";
import { routing } from "@/i18n/routing";

interface ListingDetailsPageProps {
  params: Promise<{
    locale: string;
    id: string;
    listingId: string;
  }>;
}

export async function generateStaticParams() {
  const sites = await SiteService.getSites();
  const locales = routing.locales;

  const params = await Promise.all(
    sites.map(async (site) => {
      const listings = await ListingService.getListingsBySiteId(site.id);
      return locales.flatMap((locale) =>
        listings.map((listing) => ({
          locale,
          id: String(site.id),
          listingId: String(listing.id),
        })),
      );
    }),
  );

  return params.flat();
}

const ListingDetailsPage = async ({ params }: ListingDetailsPageProps) => {
  const { id, listingId } = await params;
  const siteId = Number(id);
  const listId = Number(listingId);

  const site = await SiteService.getSiteById(siteId);
  if (!site) return notFound();

  const listings = await ListingService.getListingsBySiteId(siteId);
  const listing = listings.find((l) => l.id === listId);

  if (!listing) {
    notFound();
  }

  return (
    <PageLayout
      title={listing.title}
      goBackLink={`/sites/${id}/listings`}
      actionBlock={
        <div className="flex items-center gap-2">
          <EditListingBtn listing={listing} siteId={siteId} />
        </div>
      }
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-default-100 overflow-hidden">
        <div className="p-8">
          <ListingDetailsView listing={listing} currency={site.currency || "USD"} />
        </div>
      </div>
    </PageLayout>
  );
};

export default ListingDetailsPage;
