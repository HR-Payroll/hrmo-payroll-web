import React from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen flex flex-row font-[family-name:var(--font-arimo)] selection:bg-blue-200 selection:text-[#0000ff]">
      <Sidebar />
      <div
        style={{ flex: 1, overflow: "hidden" }}
        className="w-full h-full flex flex-col px-4"
      >
        <Topbar />
        {children}
      </div>
    </div>
  );
}
