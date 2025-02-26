import React from "react";
import Image from "next/image";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-radial from-blue-500/50 from-5% to-[#F8FAFB] to-70% z-50- text-[#333333] text-xs font-[family-name:var(--font-arimo)] selection:bg-blue-200 selection:text-[#0000ff]">
      <form className="w-fit h-fit flex flex-col justify-center items-center gap-4 rounded-md bg-white p-8 border-2 border-[#ECEEF6]">
        <h1 className="text-base font-semibold">Administrator Log In</h1>
        <Image
          src="/login.png"
          alt="Admin Log In"
          width={300}
          height={300}
          className="rounded-md"
        ></Image>
        <div className="w-full flex flex-col gap-2">
          <label>Log In Identification</label>
          <input
            type="text"
            placeholder="Username"
            className="py-2 pl-4 bg-transparent border-2 border-[#ECEEF6] rounded-md focus:outline focus:outline-blue-500"
          ></input>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            className="py-2 pl-4 bg-transparent border-2 border-[#ECEEF6] rounded-md focus:outline focus:outline-blue-500"
          ></input>
        </div>
        <div className="w-full flex flex-col gap-4">
          <Link
            href={"#"}
            className="text-blue-600 hover:text-[#0000ff] cursor-pointer"
          >
            Forgot password?
          </Link>
          <button className="w-full rounded-md bg-blue-200 hover:bg-blue-300 text-[#0000ff] active:text-white font-semibold py-2 cursor-pointer">
            <Link href="./home">Log In</Link>
          </button>
        </div>
      </form>
      <div className="mt-2">Copyright © 2025 HRMO Payroll Management</div>
    </div>
  );
};

export default LoginPage;
