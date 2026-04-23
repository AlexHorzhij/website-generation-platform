import { getTranslations } from "next-intl/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { SiteService } from "@/api/services/site-service";

interface OverviewPageProps {
  params: Promise<{ locale: string }>;
}

const OverviewPage = async ({ params }: OverviewPageProps) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DashboardStats" });
  const statsData = await SiteService.getDashboardStatistics();

  const stats = [
    { label: t("total_sites"), value: statsData.totalSites },
    { label: t("total_users"), value: statsData.totalUsers },
    { label: t("total_listings"), value: statsData.totalListings },
  ];

  if (!statsData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-default-900">
        System Statistics
      </h2>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((stat, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-default-600">
                    {stat.label}
                  </TableCell>
                  <TableCell className="text-right text-default-900 font-semibold">
                    {stat.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewPage;
