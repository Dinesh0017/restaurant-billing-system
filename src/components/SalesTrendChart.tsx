"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

type Props = {
  data: { label: string; sales: number }[];
  chartType: string;
};

export default function SalesTrendChart({ data, chartType }: Props) {
  return (
    <div className="glass-card p-6">
      <h2 className="section-title">Sales Trend</h2>
      <p className="section-subtitle mt-1">
        Revenue movement for selected period
      </p>

      <div className="mt-6 h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" />
            </BarChart>
          ) : chartType === "area" ? (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="sales" />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" strokeWidth={3} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}