"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdOutlineSpaceDashboard,
  MdWorkOutline,
  MdOutlineGroups,
  MdOutlineTableView,
  MdOutlinePayment,
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";

const sidebarItems = [
  {
    title: "",
    items: [
      {
        icon: <MdOutlineSpaceDashboard />,
        label: "Dashboard",
        href: "/home",
      },
      {
        icon: <MdWorkOutline />,
        label: "Department",
        href: "/departments",
      },
      {
        icon: <MdOutlineGroups />,
        label: "Employees",
        href: "/employees",
      },
      {
        icon: <MdOutlineTableView />,
        label: "Report",
        href: "/empReports",
      },
      {
        icon: <MdOutlinePayment />,
        label: "Payroll",
        href: "#",
        children: [
          { label: "Compensation Rate", href: "/payroll/compRate" },
          { label: "Mandatory Deductions", href: "/payroll/mandDeduc" },
          { label: "Loans and Other Deductions", href: "/payroll/loanDeduc" },
          { label: "Summary", href: "/payroll/summary" },
        ],
      },
    ],
  },
];

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const activeItem = sidebarItems
      .flatMap((i) => i.items)
      .find(
        (item) =>
          item.href === pathname ||
          item.children?.some((c) => c.href === pathname)
      );

    if (activeItem?.children) {
      setOpenMenu(activeItem.label);
    } else {
      setOpenMenu(null);
    }
  }, [pathname]);

  const toggleMenu = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  return (
    <div className="mt-4 text-sm">
      {sidebarItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-[#333333]">{i.title}</span>
          {i.items.map((item) => (
            <div key={item.label}>
              {/* Parent Item */}
              {item.children ? (
                <div
                  className={`flex items-center justify-between lg:justify-start gap-4 p-2 cursor-pointer rounded-md transition-all ${
                    pathname.includes("/payroll")
                      ? "active:bg-blue-100 border-r-[10px] border-blue-500"
                      : "hover:bg-blue-100"
                  }`}
                  onClick={() => toggleMenu(item.label)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl text-[#333333]">{item.icon}</span>
                    <span className="hidden lg:block">{item.label}</span>
                  </div>
                  {openMenu === item.label ? (
                    <MdOutlineKeyboardArrowUp className="text-xl text-[#333333]" />
                  ) : (
                    <MdOutlineKeyboardArrowDown className="text-xl text-[#333333]" />
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center justify-center lg:justify-start gap-4 p-2 cursor-pointer rounded-md transition-all ${
                    pathname === item.href
                      ? "border-r-[10px] border-blue-500"
                      : "hover:bg-blue-100"
                  }`}
                >
                  <span className="text-xl text-[#333333]">{item.icon}</span>
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              )}

              {/* Child Items */}
              {item.children && openMenu === item.label && (
                <div className="ml-6">
                  {item.children.map((subItem) => (
                    <Link
                      href={subItem.href}
                      key={subItem.label}
                      className={`flex items-center justify-center lg:justify-start gap-4 p-2 text-sm text-gray-600 rounded-md transition-all ${
                        pathname === subItem.href
                          ? "border-r-[10px] border-blue-500"
                          : "hover:bg-blue-100"
                      }`}
                    >
                      <span className="hidden lg:block">{subItem.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
