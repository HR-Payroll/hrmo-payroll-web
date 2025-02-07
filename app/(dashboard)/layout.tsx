import Link from "next/link";
import Image from "next/image";
import Sidebar from "@/app/components/Sidebar";
import Navbar from "@/app/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex">
      <div className="w-[20%] md:w-[10%] lg:w-[24%] xl:w-[20%] p-4 bg-white border-r-1 border-[#E8E8E8] drop-shadow-xl">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image src="/logo.png" alt="logo" width={50} height={50}></Image>
          <div className="hidden lg:block flex-column text-[10px] font-semibold">
            <p>OFFICE OF THE MUNICIPAL</p>
            <p>HUMAN RESOURCE MANAGEMENT</p>
          </div>
        </Link>
        <Sidebar />
      </div>
      <div className="w-[80%] md:w-[90%] lg:w-[76%] xl:w-[80%] bg-[#F8FAFB] overflow-scroll">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
