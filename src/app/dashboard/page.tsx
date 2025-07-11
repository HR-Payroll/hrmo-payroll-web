import React from "react";
import PageInfo from "@/components/PageInfo";
import TotalCard from "@/components/TotalCard";
import EmpCompChart from "@/components/EmpCompChart";
import PayCalendar from "@/components/PayCalendar";
import EmpStatsChart from "@/components/EmpStatsChart";
import { getDashboardOverview } from "@/data/dashboard-overview";
import { getRegularEmployeeStats } from "@/data/regular-emp-stats";
import { getCasualEmployeeStats } from "@/data/casual-emp-stats";
import { getJobOrderEmployeeStats } from "@/data/joborder-emp-stats";
import { getEmployeeComposition } from "@/data/employee-comp";
import {
  MdWorkOutline,
  MdOutlineGroups,
  MdOutlineGroups2,
  MdOutlineGroups3,
} from "react-icons/md";

const HomePage = async () => {
  const dashboardData = await getDashboardOverview();
  const regularData = await getRegularEmployeeStats();
  const casualData = await getCasualEmployeeStats();
  const jobOrderData = await getJobOrderEmployeeStats();
  const compositionData = await getEmployeeComposition();

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-4 pb-4">
      <header className="absolute top-4">
        <PageInfo
          title="LGU Jasaan HRMO - Payroll Management System"
          info="An automated system that integrates with DTR/biometrics to streamline payroll and boost efficiency."
        />
      </header>

      <main className="flex gap-4">
        {/* LEFT */}
        <section className="w-full flex flex-col gap-4">
          {/* TOTAL CARDS */}
          <div className="w-full flex flex-wrap justify-between gap-4">
            <TotalCard
              type="Departments"
              icon={<MdWorkOutline />}
              value={dashboardData.departments.value}
              growth={dashboardData.departments.growth}
            />
            <TotalCard
              type="Regular Employees"
              icon={<MdOutlineGroups />}
              value={dashboardData.regular.value}
              growth={dashboardData.regular.growth}
            />
            <TotalCard
              type="Casual Employees"
              icon={<MdOutlineGroups2 />}
              value={dashboardData.casual.value}
              growth={dashboardData.casual.growth}
            />
            <TotalCard
              type="Job Order Employees"
              icon={<MdOutlineGroups3 />}
              value={dashboardData.jobOrder.value}
              growth={dashboardData.jobOrder.growth}
            />
          </div>
          {/* STATISTICS */}
          <EmpStatsChart
            regularData={regularData}
            casualData={casualData}
            jobOrderData={jobOrderData}
          />
        </section>

        {/* RIGHT */}
        <section className="w-full md:w-1/3 flex flex-col gap-4">
          <PayCalendar />
          <EmpCompChart data={compositionData} />
        </section>
      </main>
    </div>
  );
};

export default HomePage;
