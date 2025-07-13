"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface CompositionData {
  name: string;
  value: number;
}

const COLORS = ["#3b82f6", "#60a5fa", "#93c5fd"];

const EmpCompChart = ({ data }: { data: CompositionData[] }) => {
  return (
    <div className="rounded-md bg-white border-2 border-[var(--border)] p-4 text-xs text-[var(--text)]">
      <div>
        <h1 className="text-base font-medium">Employee Composition</h1>
      </div>
      <div>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: "#F8FAFB",
                borderRadius: "5px",
                color: "#333",
              }}
              cursor={{ fill: "rgba(219, 234, 254, 0.5)" }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={20}
              outerRadius={95}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmpCompChart;
