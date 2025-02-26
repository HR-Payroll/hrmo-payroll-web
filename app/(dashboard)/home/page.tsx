import React from "react";
import TotalCard from "@/app/components/TotalCard";
import StatsChart from "@/app/components/EmpStatsChart";
import PayCalendar from "@/app/components/PayCalendar";
import CompChart from "@/app/components/EmpCompChart";
import {
  MdWorkOutline,
  MdOutlineGroups,
  MdOutlineGroups2,
  MdOutlineGroups3,
} from "react-icons/md";

const HomePage = () => {
  return (
    <div className="flex flex-col md:flex-row mt-10 lg:mt-0 gap-4 px-4 pb-4">
      {/* LEFT */}
      <div className="w-full h-full lg:w-2/3 flex flex-col gap-4">
        {/* TOTAL CARDS */}
        <div className="flex flex-wrap justify-between gap-4">
          <TotalCard
            type="Departments"
            icon={<MdWorkOutline />}
            value={20}
            growth="+5% from last month"
          />
          <TotalCard
            type="Regular Employees"
            icon={<MdOutlineGroups />}
            value={100}
            growth="+3% from last month"
          />
          <TotalCard
            type="Casual Employees"
            icon={<MdOutlineGroups2 />}
            value={150}
            growth="+2% from last month"
          />
          <TotalCard
            type="Job Order Employees"
            icon={<MdOutlineGroups3 />}
            value={300}
            growth="+4% from last month"
          />
        </div>
        {/* STATISTICS */}
        <div className="w-full h-full">
          <StatsChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full h-full lg:w-1/3 flex flex-col gap-4">
        {/* PAY DATE */}
        <div className="w-full h-full">
          <PayCalendar />
        </div>
        {/* COMPOSITION */}
        <div className="w-full h-full">
          <CompChart />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
