"use client";

import { useState, useMemo } from "react";
import { useListings } from "@/api/hooks/use-listings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import {
  format,
  subDays,
  subMonths,
  subQuarters,
  subYears,
  isAfter,
  eachDayOfInterval,
  startOfDay,
  isSameDay,
} from "date-fns";
import { Loader2 } from "lucide-react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { useTranslations } from "next-intl";

interface ListingAnalyticsProps {
  siteId: number;
}

type Period = "1w" | "1m" | "1q" | "1y";

const ListingAnalytics = ({ siteId }: ListingAnalyticsProps) => {
  const t = useTranslations("Listings");
  const { data: listings, isLoading } = useListings(siteId);
  const [period, setPeriod] = useState<Period>("1w");
  const { theme: mode } = useTheme();

  const chartData = useMemo(() => {
    if (!listings) return { series: [], categories: [] };

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "1w":
        startDate = subDays(now, 6);
        break;
      case "1m":
        startDate = subMonths(now, 1);
        break;
      case "1q":
        startDate = subQuarters(now, 1);
        break;
      case "1y":
        startDate = subYears(now, 1);
        break;
      default:
        startDate = subDays(now, 6);
    }

    const interval = eachDayOfInterval({
      start: startOfDay(startDate),
      end: startOfDay(now),
    });

    const categories = interval.map((date) => {
      if (period === "1w" || period === "1m") {
        return format(date, "dd MMM");
      }
      if (period === "1q") {
        return format(date, "dd/MM");
      }
      return format(date, "MMM dd");
    });

    const counts = interval.map((date) => {
      return listings.filter((listing) => {
        const createdAt = new Date(listing.createdAt);
        return isSameDay(createdAt, date);
      }).length;
    });

    const totalInPeriod = counts.reduce((a, b) => a + b, 0);

    return {
      series: [
        {
          name: t("title"),
          data: counts,
        },
      ],
      categories,
      totalInPeriod,
    };
  }, [listings, period, t]);

  const options: any = {
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    colors: ["#0ea5e9"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          colors: "rgb(156, 163, 175)",
          fontSize: "12px",
        },
        rotate: period === "1w" ? 0 : -45,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "rgb(156, 163, 175)",
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor:
        mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
      strokeDashArray: 4,
    },
    tooltip: {
      theme: mode === "dark" ? "dark" : "light",
    },
  };

  if (isLoading) {
    return (
      <Card className="h-[400px] flex items-center justify-center border-none shadow-sm">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-bold">
            {t("performance_title")}
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-default-900">
              {chartData.totalInPeriod}
            </span>
            <span className="text-xs text-muted-foreground self-end mb-1">
              {t("total_in_period")}
            </span>
          </div>
        </div>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <TabsList className="bg-default-100">
            <TabsTrigger
              value="1w"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              1W
            </TabsTrigger>
            <TabsTrigger
              value="1m"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              1M
            </TabsTrigger>
            <TabsTrigger
              value="1q"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              1Q
            </TabsTrigger>
            <TabsTrigger
              value="1y"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              1Y
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <Chart
            options={options}
            series={chartData.series}
            type="area"
            height="100%"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingAnalytics;
