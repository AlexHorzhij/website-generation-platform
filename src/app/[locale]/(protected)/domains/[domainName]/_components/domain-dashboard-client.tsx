"use client";

import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Globe, Server, LayoutGrid } from "lucide-react";
import { DomainDashboard } from "@/api/types/domain";

interface DomainDashboardClientProps {
  data: DomainDashboard | undefined;
}

export function DomainDashboardClient({ data }: DomainDashboardClientProps) {
  const t = useTranslations("DomainDetails");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  console.log("domain data tetails", data);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-default-400">
        <Globe className="w-12 h-12 opacity-40" />
        <p className="text-lg">{t("not_found")}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/${locale}/domains`)}
        >
          <Icon icon="heroicons:arrow-left" className="w-4 h-4 mr-2" />
          {t("back_to_domains")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-none">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-default-500">{t("total_domains")}</p>
              <p className="text-2xl font-bold text-default-900">
                {data.domains.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center flex-none">
              <Server className="w-6 h-6 text-violet-500" />
            </div>
            <div>
              <p className="text-sm text-default-500">
                {t("total_subdomains")}
              </p>
              <p className="text-2xl font-bold text-default-900">
                {data.subdomains.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-none">
              <LayoutGrid className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-default-500">{t("total_tlds")}</p>
              <p className="text-2xl font-bold text-default-900">
                {data.tlds.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Domains Table */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
        <CardHeader className="pb-2 px-6 pt-5">
          <CardTitle className="text-base font-semibold text-default-900">
            {t("registered_domains")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white dark:bg-slate-900 border-y border-default-100">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="h-12 px-6 text-[11px] font-bold uppercase tracking-wider text-default-700">
                    {t("col_name")}
                  </TableHead>
                  <TableHead className="h-12 px-6 text-[11px] font-bold uppercase tracking-wider text-default-700">
                    {t("col_tld")}
                  </TableHead>
                  <TableHead className="h-12 px-6 text-[11px] font-bold uppercase tracking-wider text-default-700">
                    {t("col_status")}
                  </TableHead>
                  <TableHead className="h-12 px-6 text-[11px] font-bold uppercase tracking-wider text-default-700">
                    {t("col_expiration")}
                  </TableHead>
                  <TableHead className="h-12 px-6 text-[11px] font-bold uppercase tracking-wider text-default-700">
                    {t("col_cost")}
                  </TableHead>
                  <TableHead className="h-12 px-6 text-[11px] font-bold uppercase tracking-wider text-default-700">
                    {t("col_available")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.domains.length ? (
                  data.domains.map((domain, i) => (
                    <TableRow
                      key={i}
                      className="h-12 border-b border-default-50 hover:bg-default-50/50 transition-colors"
                    >
                      <TableCell className="px-6 font-medium text-default-900 lowercase">
                        {domain.name}
                      </TableCell>
                      <TableCell className="px-6 text-default-500 lowercase">
                        {domain.tld}
                      </TableCell>
                      <TableCell className="px-6">
                        <Badge
                          color={
                            domain.status === "active" ? "success" : "warning"
                          }
                          className="capitalize rounded-full px-3 py-0.5 text-[11px] font-semibold"
                        >
                          {domain.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 text-default-500 whitespace-nowrap">
                        {domain.expirationDate
                          ? new Date(domain.expirationDate).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell className="px-6 text-default-500">
                        ${domain.cost}
                      </TableCell>
                      <TableCell className="px-6">
                        <Badge
                          color={domain.available ? "success" : "secondary"}
                          className="rounded-full px-3 py-0.5 text-[11px] font-semibold"
                        >
                          {domain.available ? t("yes") : t("no")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-20 text-center text-default-400"
                    >
                      {t("no_domains")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Subdomains Table */}
      {data.subdomains.length > 0 && (
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader className="pb-2 px-6 pt-5">
            <CardTitle className="text-base font-semibold text-default-900">
              {t("subdomains")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-white dark:bg-slate-900 border-y border-default-100">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="h-12 px-6 text-[11px] font-bold uppercase tracking-wider text-default-700">
                      {t("col_name")}
                    </TableHead>
                    <TableHead className="h-12 px-6 text-[11px] font-bold uppercase tracking-wider text-default-700">
                      {t("col_target")}
                    </TableHead>
                    <TableHead className="h-12 px-6 text-[11px] font-bold uppercase tracking-wider text-default-700">
                      {t("col_type")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.subdomains.map((sub, i) => (
                    <TableRow
                      key={i}
                      className="h-12 border-b border-default-50 hover:bg-default-50/50 transition-colors"
                    >
                      <TableCell className="px-6 font-medium text-default-900">
                        {sub.name}
                      </TableCell>
                      <TableCell className="px-6 text-default-500">
                        {sub.target}
                      </TableCell>
                      <TableCell className="px-6">
                        <Badge
                          color="info"
                          className="rounded-full px-3 py-0.5 text-[11px] font-semibold uppercase"
                        >
                          {sub.type}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TLDs Table */}
      {data.tlds.length > 0 && (
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader className="pb-2 px-6 pt-5">
            <CardTitle className="text-base font-semibold text-default-900">
              {t("available_tlds")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-white dark:bg-slate-900 border-y border-default-100">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="h-12 px-6 text-[11px] font-bold uppercase tracking-wider text-default-700">
                      {t("tld_name")}
                    </TableHead>
                    <TableHead className="h-12 px-6 text-[11px] font-bold uppercase tracking-wider text-default-700">
                      {t("tld_registration")}
                    </TableHead>
                    <TableHead className="h-12 px-6 text-[11px] font-bold uppercase tracking-wider text-default-700">
                      {t("tld_renewal")}
                    </TableHead>
                    <TableHead className="h-12 px-6 text-[11px] font-bold uppercase tracking-wider text-default-700">
                      {t("tld_transfer")}
                    </TableHead>
                    <TableHead className="h-12 px-6 text-[11px] font-bold uppercase tracking-wider text-default-700">
                      {t("tld_currency")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.tlds.map((tld, i) => (
                    <TableRow
                      key={i}
                      className="h-12 border-b border-default-50 hover:bg-default-50/50 transition-colors"
                    >
                      <TableCell className="px-6 font-semibold text-default-900 lowercase">
                        .{tld.name}
                      </TableCell>
                      <TableCell className="px-6 text-default-500 lowercase">
                        ${tld.registrationPrice}
                      </TableCell>
                      <TableCell className="px-6 text-default-500">
                        ${tld.renewalPrice}
                      </TableCell>
                      <TableCell className="px-6 text-default-500">
                        ${tld.transferPrice}
                      </TableCell>
                      <TableCell className="px-6">
                        <Badge
                          color="secondary"
                          className="rounded-full px-3 py-0.5 text-[11px] font-semibold uppercase"
                        >
                          {tld.currency}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
