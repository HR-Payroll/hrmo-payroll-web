"use client";
import React from "react";
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

const data = [
  { name: "Jan", reg: 300, cas: 100, j_o: 250 },
  { name: "Feb", reg: 300, cas: 100, j_o: 250 },
  { name: "Mar", reg: 300, cas: 100, j_o: 250 },
  { name: "Apr", reg: 300, cas: 100, j_o: 250 },
  { name: "May", reg: 300, cas: 100, j_o: 250 },
  { name: "Jun", reg: 300, cas: 100, j_o: 250 },
  { name: "Jul", reg: 300, cas: 100, j_o: 250 },
  { name: "Aug", reg: 300, cas: 100, j_o: 250 },
  { name: "Sep", reg: 300, cas: 100, j_o: 250 },
  { name: "Oct", reg: 300, cas: 100, j_o: 250 },
  { name: "Nov", reg: 300, cas: 100, j_o: 250 },
  { name: "Dec", reg: 300, cas: 100, j_o: 250 },
];

const EmployeeStatsChart = () => {
  return (
    <div className="rounded-md bg-white border-2 border-[#ECEEF6] p-4 text-xs text-[#333333]">
      <div>
        <h1 className="text-base font-medium">Employee Statistics</h1>
      </div>
      <div className="mt-2 -ml-8">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#ECEEF6"
            />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#F8FAFB",
                borderRadius: "5px",
                color: "#333",
              }}
              cursor={{ fill: "rgba(219, 234, 254, 0.5)" }}
            />
            <Legend />
            <Bar
              dataKey="reg"
              fill="#3b82f6"
              legendType="circle"
              radius={[10, 10, 0, 0]}
            />
            <Bar
              dataKey="cas"
              fill="#60a5fa"
              legendType="circle"
              radius={[10, 10, 0, 0]}
            />
            <Bar
              dataKey="j_o"
              fill="#93c5fd"
              legendType="circle"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmployeeStatsChart;
