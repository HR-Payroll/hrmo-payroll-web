"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Dept A", value: 10 },
  { name: "Dept B", value: 15 },
  { name: "Dept C", value: 20 },
  { name: "Dept D", value: 25 },
  { name: "Dept E", value: 30 },
  { name: "Dept F", value: 35 },
  { name: "Dept G", value: 40 },
  { name: "Dept H", value: 45 },
  { name: "Dept I", value: 50 },
  { name: "Dept J", value: 55 },
  { name: "Dept K", value: 60 },
  { name: "Dept L", value: 65 },
  { name: "Dept M", value: 70 },
  { name: "Dept N", value: 75 },
  { name: "Dept O", value: 80 },
  { name: "Dept P", value: 85 },
  { name: "Dept Q", value: 90 },
  { name: "Dept R", value: 95 },
  { name: "Dept S", value: 100 },
  { name: "Dept T", value: 105 },
];

const COLORS = [
  "#99f6e4",
  "#a5f3fc",
  "#bae6fd",
  "#bfdbfe",
  "#c7d2fe",
  "#5eead4",
  "#67e8f9",
  "#7dd3fc",
  "#93c5fd",
  "#a5b4fc",
  "#2dd4bf",
  "#22d3ee",
  "#38bdf8",
  "#60a5fa",
  "#818cf8",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="grayblack"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={10}
    >
      {`${data[index].name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

const EmployeeCompositionChart = () => {
  return (
    <div className="rounded-md bg-white border-2 border-[#ECEEF6] p-4 text-xs text-[#333333]">
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
              cursor={{ fill: "rgba(255, 255, 255, 0.2)" }}
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

export default EmployeeCompositionChart;
