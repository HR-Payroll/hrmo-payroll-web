import React from "react";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row font-[family-name:var(--font-arimo)] selection:bg-blue-200 selection:text-[#0000ff]">
      <Sidebar />
      <div className="w-full flex flex-col pl-16">
        <Topbar />
        {children}
      </div>
    </div>
  );
}
