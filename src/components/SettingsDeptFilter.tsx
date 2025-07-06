"use client";
import React, { useState } from "react";

const SettingsDeptFilter = ({
  departments,
}: {
  departments: {
    name: string;
    category: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const CATEGORY_OPTIONS: Record<string, string> = {
    "All Category": "",
    Regular: "REGULAR",
    Casual: "CASUAL",
    "Job Order": "JOB_ORDER",
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
  };

  const filteredDepartments = departments.filter((item) =>
    categoryFilter === "" ? true : item.category === categoryFilter
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-x-3 text-[var(--text)] text-sm">
      <select
        className="outline-none rounded-md border-2 border-[var(--border)] py-1 px-2 cursor-pointer"
        onChange={handleCategoryChange}
        value={categoryFilter}
      >
        {Object.entries(CATEGORY_OPTIONS).map(([label, value]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      of
      <select className="outline-none rounded-md border-2 border-[var(--border)] py-1 px-2 cursor-pointer">
        <option key="0" value="">
          All Departments
        </option>
        {filteredDepartments.map((item) => {
          const categoryLabels = {
            REGULAR: "Regular",
            CASUAL: "Casual",
            JOB_ORDER: "Job Order",
          } as const;

          return (
            <option key={item.id} value={item.id}>
              {`${item.name} - ${
                categoryLabels[item.category as keyof typeof categoryLabels]
              }`}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SettingsDeptFilter;
