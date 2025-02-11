import React from "react";
import Image from "next/image";

const LoginPage = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center font-sans">
      <form className="w-sm h-fit flex flex-col items-start gap-3 rounded-md bg-gray-50 p-10 drop-shadow-[0_0_250px_rgba(59,130,246,0.80)]  border-2 border-indigo-50">
        <h1 className="text-2xl font-semibold text-neutral-800">
          Administrator Log In
        </h1>
        <Image
          src="/login.png"
          alt="Admin Log In"
          width={500}
          height={500}
          className="rounded-sm"
        ></Image>
        <p className="text-neutral-800 text-base">Log In Identification</p>
        <input
          type="text"
          placeholder="username"
          className="w-full py-2 pl-6 bg-white border-2 border-indigo-50 rounded-sm"
        ></input>
        <p className="text-neutral-800 text-base">Password</p>
        <input
          type="password"
          placeholder="password"
          className="w-full py-2 pl-6 bg-white border-2 border-indigo-50 rounded-sm"
        ></input>
        <p className="text-blue-700 text-base">Forgot password?</p>
        <button className="w-full rounded-sm bg-blue-700/20 py-2 text-blue-700 text-base">
          Log In
        </button>
      </form>
      <div className="mt-2 text-neutral-800 text-base">
        Copyright © 2025 HR Payroll Management
      </div>
    </div>
  );
};

export default LoginPage;
