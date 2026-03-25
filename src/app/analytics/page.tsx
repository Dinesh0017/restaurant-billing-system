"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AnalyticsCards from "@/components/AnalyticsCards";
import AnalyticsFilters from "@/components/AnalyticsFilters";
import SalesTrendChart from "@/components/SalesTrendChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import TopItemsTable from "@/components/TopItemsTable";

type AnalyticsResponse = {
  summary: {
    totalRevenue: number;
    totalBills: number;
    totalItemsSold: number;
    averageBill: number;
  };
  salesTrend: { label: string; sales: number }[];
  categoryBreakdown: { name: string; value: number }[];
  topItems: { name: string; qty: number; revenue: number }[];
};

export default function AnalyticsPage() {
  const [range, setRange] = useState("today");
  const [chartType, setChartType] = useState("line");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<AnalyticsResponse>({
    summary: {
      totalRevenue: 0,
      totalBills: 0,
      totalItemsSold: 0,
      averageBill: 0,
    },
    salesTrend: [],
    categoryBreakdown: [],
    topItems: [],
  });

  async function loadAnalytics() {
    try {
      setLoading(true);

      let url = `/api/analytics?range=${range}`;

      if (range === "custom" && startDate && endDate) {
        url += `&start=${startDate}&end=${endDate}`;
      }

      const res = await fetch(url);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to load analytics");
      }

      setData(result);
    } catch (error: any) {
      toast.error(error.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (range === "custom") {
      if (startDate && endDate) {
        loadAnalytics();
      }
    } else {
      loadAnalytics();
    }
  }, [range, startDate, endDate]);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="section-title">Analytics & Reports</h1>
        <p className="section-subtitle mt-1">
          View sales insights by day, week, month, year or custom range
        </p>
      </div>

      <AnalyticsFilters
        range={range}
        setRange={setRange}
        chartType={chartType}
        setChartType={setChartType}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <AnalyticsCards summary={data.summary} />

      {loading ? (
        <div className="glass-card p-6">Loading analytics...</div>
      ) : (
        <>
          <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
            <SalesTrendChart data={data.salesTrend} chartType={chartType} />
            <CategoryPieChart data={data.categoryBreakdown} />
          </div>

          <TopItemsTable items={data.topItems} />
        </>
      )}
    </div>
  );
}