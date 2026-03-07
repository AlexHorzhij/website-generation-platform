import { getTranslations } from "next-intl/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { DomainService } from "@/api/services/domain-service";
import { domainKeys } from "@/api/hooks/use-domains";
import { DomainsClient } from "./_components/domains-client";

const DomainsPage = async () => {
  const t = await getTranslations("DomainsManagement");
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: domainKeys.lists(),
    queryFn: () => DomainService.getDomains(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DomainsClient title={t("title")} />
    </HydrationBoundary>
  );
};

export default DomainsPage;

// {
//     "domainName": "mpcrm.click",
//     "regionId": "us-east-1",
//     "owner": {
//         "id": 2,
//         "username": "bovsunovsky",
//         "email": "dima@gmail.com",
//         "passwordHash": "$2a$10$pj.pfQx/KKCViqFCJrx3bu1YElu9B3trl8GAn3PeNjf9B1dxaZ43.",
//         "role": "ADMIN",
//         "createdAt": "2025-10-20T14:31:27.532897",
//         "site": null
//     },
//     "price": 3.6,
//     "currency": "USD",
//     "renewalPrice": 3.6,
//     "hasMarketplace": false
// }
