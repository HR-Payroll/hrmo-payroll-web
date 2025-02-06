import React from "react";
import TotalCard from "@/app/components/totalCard";
import StatsChart from "@/app/components/empStatsChart";

const HomePage = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 px-4 pb-4">
      {/* LEFT */}
      <div className="w-full lg:w-2/3">
        {/* TOTAL CARDS */}
        <div className="flex flex-wrap justify-between gap-4">
          <TotalCard type="Departments" />
          <TotalCard type="Regular Employees" />
          <TotalCard type="Casual Employees" />
          <TotalCard type="Job Order Employees" />
        </div>
        {/* STATISTICS */}
        <div className="w-full h-[500px] mt-4">
          <StatsChart />
        </div>
      </div>
      <div className="w-full lg:w-1/3"></div>
    </div>
  );
};

export default HomePage;
