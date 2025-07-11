"use client";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ChartType = "REGULAR" | "CASUAL" | "JOB_ORDER";

interface EmpStatsChartProps {
  regularData: { name: string; total: number }[];
  casualData: { name: string; total: number }[];
  jobOrderData: { name: string; total: number }[];
}

const EmpStatsChart = ({
  regularData,
  casualData,
  jobOrderData,
}: EmpStatsChartProps) => {
  const [showLabels, setShowLabels] = useState(false);
  const [chartType, setChartType] = useState<ChartType>("REGULAR");

  const toggleLabels = () => setShowLabels((prev) => !prev);

  const getChartProps = () => {
    switch (chartType) {
      case "REGULAR":
        return {
          title: "Regular Employees per Department",
          data: regularData,
        };
      case "CASUAL":
        return {
          title: "Casual Employees per Department",
          data: casualData,
        };
      case "JOB_ORDER":
        return {
          title: "Job Order Employees per Department",
          data: jobOrderData,
        };
    }
  };

  const { title, data } = getChartProps();

  return (
    <div className="rounded-md bg-white border-2 border-[var(--border)] p-4 text-xs text-[var(--text)] overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <h1 className="text-base font-medium">{title}</h1>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={toggleLabels}
            className="text-[11px] px-2 py-1 rounded bg-[var(--softcyan)] hover:opacity-80 transition cursor-pointer"
          >
            {showLabels ? "Hide Labels" : "Show Labels"}
          </button>

          {(["REGULAR", "CASUAL", "JOB_ORDER"] as ChartType[]).map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`text-[11px] px-2 py-1 rounded-md border font-medium cursor-pointer transition ${
                chartType === type
                  ? "bg-[#3b82f6] text-white"
                  : "bg-white border-[var(--border)] text-gray-700"
              }`}
            >
              {type
                .replace("_", " ")
                .toLowerCase()
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      <div className="-ml-10">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#ECEEF6"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={showLabels ? undefined : false}
              height={showLabels ? 100 : 0}
              angle={showLabels ? -45 : 0}
              textAnchor="end"
              interval={0}
            />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#F8FAFB",
                borderRadius: "5px",
                color: "#333",
              }}
              cursor={{ fill: "rgba(219, 234, 254, 0.8)" }}
            />
            <Legend
              align="left"
              verticalAlign="top"
              wrapperStyle={{ paddingLeft: "60px", paddingBottom: "10px" }}
            />
            <Bar
              dataKey="total"
              fill="#3b82f6"
              legendType="circle"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmpStatsChart;
