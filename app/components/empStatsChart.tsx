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

const EmployeeStatsChart: React.FC = () => {
  return (
    <div className="rounded-md bg-white border-2 border-[#ECEEF6] p-4 text-xs text-[#333333]">
      <div className="flex flex-row justify-between">
        <h1 className="text-xl font-semibold">Employee Statistics</h1>
      </div>
      <div className="mt-4 -ml-8">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="reg" fill="#86efac" />
            <Bar dataKey="cas" fill="#93c5fd" />
            <Bar dataKey="j_o" fill="#fca5a5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmployeeStatsChart;
