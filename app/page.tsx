import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="w-screen h-screen flex flex-row items-center justify-center gap-10 text-[#333] font-[family-name:var(--font-arimo)] selection:bg-blue-200 selection:text-[#0000ff]">
      <Image src="/logo.png" alt="logo" width={200} height={200}></Image>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Welcome to</h1>
        <h1 className="text-4xl font-black">
          HRMO - Payroll Management System
        </h1>
        <h1 className="italic text-base font-medium">
          Simplifying Payroll, Enhancing Efficiency
        </h1>
        <Link
          href="/login"
          className="w-fit rounded-full transform transition duration-500 hover:scale-110 bg-blue-500 hover:bg-blue-700 text-white text-sm py-2 px-10 mt-8"
        >
          Log In here
        </Link>
      </div>
    </main>
  );
}
