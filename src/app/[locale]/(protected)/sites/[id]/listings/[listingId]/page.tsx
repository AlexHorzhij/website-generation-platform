import { SiteService } from "@/api/services/site-service";
import { ListingService } from "@/api/services/listing-service";
import { notFound } from "next/navigation";
import { PageLayout } from "../../../_components/page-layout";
import { ListingDetailsView } from "../_components/listing-details-view";

import { EditListingBtn } from "../_components/edit-listing-btn";

interface ListingDetailsPageProps {
  params: Promise<{
    locale: string;
    id: string;
    listingId: string;
  }>;
}

const ListingDetailsPage = async ({ params }: ListingDetailsPageProps) => {
  const { id, listingId } = await params;
  const site = await SiteService.getSiteById(Number(id));
  const listing = await ListingService.getListingById(Number(listingId));

  if (!site || !listing) {
    notFound();
  }

  return (
    <PageLayout
      title={site.marketplaceName}
      goBackLink={`/sites/${id}/listings`}
      actionBlock={
        <div className="flex items-center gap-2">
          <EditListingBtn listing={listing} siteId={Number(id)} />
        </div>
      }
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-default-100 overflow-hidden">
        <div className="p-8">
          <ListingDetailsView listing={listing} currency={site.currency} />
        </div>
      </div>
    </PageLayout>
  );
};

export default ListingDetailsPage;
