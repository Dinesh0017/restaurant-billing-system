"use client";

type Props = {
  range: string;
  setRange: (value: string) => void;
  chartType: string;
  setChartType: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
};

export default function AnalyticsFilters({
  range,
  setRange,
  chartType,
  setChartType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: Props) {
  const ranges = [
    { key: "today", label: "Today" },
    { key: "last7days", label: "Last 7 Days" },
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
    { key: "yearly", label: "Yearly" },
    { key: "custom", label: "Custom" },
  ];

  return (
    <div className="glass-card p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex flex-wrap gap-2">
          {ranges.map((item) => (
            <button
              key={item.key}
              onClick={() => setRange(item.key)}
              className={`category-chip ${
                range === item.key ? "category-chip-active" : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {range === "custom" && (
            <>
              <input
                type="date"
                className="input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                className="input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </>
          )}

          <select
            className="select"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="area">Area Chart</option>
          </select>
        </div>
      </div>
    </div>
  );
}