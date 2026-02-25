import { getTranslations } from "next-intl/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

const OverviewPage = async () => {
  const t = await getTranslations("DashboardStats");

  const stats = [
    { label: t("total_sites"), value: 4 },
    { label: t("total_users"), value: 11 },
    { label: t("total_listings"), value: 875 },
  ];

  return (
    <div className="space-y-6">
      {/* <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon
            icon="heroicons:globe-alt"
            className="w-8 h-8 text-default-900"
          /> */}
      <h2 className="text-2xl font-semibold text-default-900">
        System Statistics
      </h2>
      {/* </div>
      </div> */}

      <Card>
        {/* <CardHeader>
          <CardTitle>System Statistics</CardTitle>
        </CardHeader> */}
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
