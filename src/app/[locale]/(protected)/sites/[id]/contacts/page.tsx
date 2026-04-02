import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { ContactService } from "@/api/services/contact-service";
import { SiteService } from "@/api/services/site-service";
import { contactKeys } from "@/api/hooks/use-contacts";
import { ContactsClient } from "./_components/contacts-client";
import { SitePageLayout } from "../../_components/site-page-layout";
import { ContactsHeaderActions } from "./_components/contacts-header-actions";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

const SiteContactsPage = async ({ params }: Props) => {
  const { id } = await params;
  const siteId = Number(id);
  const site = await SiteService.getSiteById(siteId);

  if (!site) {
    notFound();
  }

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: contactKeys.lists(siteId),
    queryFn: () => ContactService.getContacts(siteId),
  });

  return (
    <SitePageLayout
      site={site}
      actionBlock={<ContactsHeaderActions siteId={siteId} />}
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ContactsClient siteId={siteId} />
      </HydrationBoundary>
    </SitePageLayout>
  );
};

export default SiteContactsPage;
