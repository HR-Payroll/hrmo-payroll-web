"use client";
import React, { JSX, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MdOutlineMenu,
  MdOutlineSpaceDashboard,
  MdWorkOutline,
  MdOutlineGroups,
  MdOutlineTableView,
  MdOutlinePayment,
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
  MdOutlineHorizontalRule,
} from "react-icons/md";

interface SidebarItemProps {
  href: string;
  icon: JSX.Element;
  label: string;
  isCollapsed: boolean;
}

const SidebarItem = ({ href, icon, label, isCollapsed }: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 px-4 min-h-11 hover:bg-blue-100 border-l-[10px] border-l-transparent hover:border-blue-500 focus:border-blue-500 focus:bg-blue-100 focus:border-l-[10px] focus:text-[var(--accent)] transition-all ease-in-out duration-700"
    >
      {icon}
      {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPayrollExpanded, setIsPayrollExpanded] = useState(false);

  const payrollItems = [
    {
      label: "Compensation Rate",
      link: "/compensation-rate",
      icon: "",
    },
    {
      label: "Mandatory Deductions",
      link: "/mandatory-deduction",
      icon: "",
    },
    {
      label: "Loans & Deductions",
      link: "/loan-deduction",
      icon: "",
    },
    {
      label: "Summary",
      link: "/summary",
      icon: "",
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`h-screen left-0 top-0 z-50 bg-white text-[var(--text)] drop-shadow-2xl font-[family-name:var(--font-arimo)] selection:bg-blue-200 selection:text-[var(--accent)] transition-all ${
        isCollapsed ? "min-w-16" : "min-w-[12%]"
      }`}
    >
      <div className="flex items-center justify-between border-b-2 border-[var(--border)] p-3">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center justify-center">
            <Image
              src="/hrmo.png"
              alt="HRMO Logo"
              width={200}
              height={200}
            ></Image>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-full hover:bg-blue-100 active:bg-blue-200 active:text-[var(--accent)] p-2 cursor-pointer"
        >
          <MdOutlineMenu size={24} />
        </button>
      </div>

      <nav className="mt-2">
        <SidebarItem
          href="/dashboard"
          icon={<MdOutlineSpaceDashboard size={20} />}
          label="Dashboard"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          href="/dashboard/departments"
          icon={<MdWorkOutline size={20} />}
          label="Departments"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          href="/dashboard/employees"
          icon={<MdOutlineGroups size={20} />}
          label="Employees"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          href="/dashboard/reports"
          icon={<MdOutlineTableView size={20} />}
          label="Reports"
          isCollapsed={isCollapsed}
        />

        <div>
          <button
            onClick={() => setIsPayrollExpanded(!isPayrollExpanded)}
            className="flex items-center gap-4 px-4 py-2 w-full hover:bg-blue-100 border-l-[10px] border-l-transparent hover:border-blue-500 focus:text-[var(--accent)] cursor-pointer transition-all ease-in-out duration-700"
          >
            <MdOutlinePayment size={20} />
            {!isCollapsed && (
              <span className="text-sm font-medium">Payroll</span>
            )}
            {!isCollapsed &&
              (isPayrollExpanded ? (
                <MdOutlineKeyboardArrowUp
                  size={20}
                  className="ml-auto cursor-pointer"
                />
              ) : (
                <MdOutlineKeyboardArrowDown
                  size={20}
                  className="ml-auto cursor-pointer"
                />
              ))}
          </button>

          <div className={`${isPayrollExpanded ? "block" : "hidden"} ml-6`}>
            {!isCollapsed &&
              payrollItems.map((item) => {
                return (
                  <Link
                    key={item.label}
                    href={`/dashboard/payroll${item.link}`}
                    className="flex items-center gap-4 px-4 min-h-10 hover:bg-blue-100 border-l-[10px] border-l-transparent hover:border-blue-500 focus:border-blue-500 focus:bg-blue-100 focus:border-l-[10px] focus:text-[var(--accent)] transition-all ease-in-out duration-700"
                  >
                    <MdOutlineHorizontalRule size={16} />
                    {!isCollapsed && (
                      <span className="text-sm font-normal">{item.label}</span>
                    )}
                  </Link>
                );
              })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
