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
      className="flex items-center gap-4 px-4 py-2 hover:bg-blue-100 hover:border-l-[10px] hover:border-blue-500 focus:border-blue-500 focus:bg-blue-100 focus:border-l-[10px] focus:text-[#0000ff] transition-all ease-in-out duration-700"
    >
      {icon}
      {!isCollapsed && <span className="text-xs font-medium">{label}</span>}
    </Link>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPayrollExpanded, setIsPayrollExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`h-screen fixed left-0 top-0 z-50 bg-white text-[#333333] drop-shadow-2xl font-[family-name:var(--font-arimo)] selection:bg-blue-200 selection:text-[#0000ff] transition-all ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between border-b-2 border-[#ECEEF6] p-3">
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
          className="rounded-full hover:bg-blue-100 active:bg-blue-200 active:text-[#0000ff] text-[#333333] p-2 cursor-pointer"
        >
          <MdOutlineMenu size={20} />
        </button>
      </div>

      <nav className="mt-2">
        <SidebarItem
          href="/dashboard"
          icon={<MdOutlineSpaceDashboard size={16} />}
          label="Dashboard"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          href="/dashboard/departments"
          icon={<MdWorkOutline size={16} />}
          label="Departments"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          href="/dashboard/employees"
          icon={<MdOutlineGroups size={16} />}
          label="Employees"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          href="/dashboard/reports"
          icon={<MdOutlineTableView size={16} />}
          label="Reports"
          isCollapsed={isCollapsed}
        />

        <div>
          <button
            onClick={() => setIsPayrollExpanded(!isPayrollExpanded)}
            className="flex items-center gap-4 px-4 py-2 w-full hover:bg-blue-100 hover:border-l-[10px] hover:border-blue-500 focus:text-[#0000ff] cursor-pointer transition-all ease-in-out duration-700"
          >
            <MdOutlinePayment size={16} />
            {!isCollapsed && (
              <span className="text-xs font-medium">Payroll</span>
            )}
            {!isCollapsed &&
              (isPayrollExpanded ? (
                <MdOutlineKeyboardArrowUp
                  size={16}
                  className="ml-auto cursor-pointer"
                />
              ) : (
                <MdOutlineKeyboardArrowDown
                  size={16}
                  className="ml-auto cursor-pointer"
                />
              ))}
          </button>

          <div className={`${isPayrollExpanded ? "block" : "hidden"} ml-6`}>
            <SidebarItem
              href="/dashboard/payroll/compensation-rate"
              icon={<MdOutlineHorizontalRule size={16} />}
              label="Compensation Rate"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              href="/dashboard/payroll/mandatory-deduction"
              icon={<MdOutlineHorizontalRule size={16} />}
              label="Mandatory Deductions"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              href="/dashboard/payroll/loan-deduction"
              icon={<MdOutlineHorizontalRule size={16} />}
              label="Loans & Deductions"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              href="/dashboard/payroll/summary"
              icon={<MdOutlineHorizontalRule size={16} />}
              label="Summary"
              isCollapsed={isCollapsed}
            />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
