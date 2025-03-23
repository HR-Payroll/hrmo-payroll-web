import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";

const LoginPage = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-radial from-blue-500/50 from-5% to-[var(--slate)] to-70% z-50- text-[var(--text)] text-sm font-[family-name:var(--font-arimo)] selection:bg-blue-200 selection:text-[var(--accent)]">
      <div className="w-fit h-fit flex flex-col justify-center items-center gap-4 rounded-md bg-white p-8 border-2 border-[var(--border)]">
        <h1 className="text-lg font-semibold">Administrator Log In</h1>
        <Image
          src="/login.png"
          alt="Admin Log In"
          width={300}
          height={300}
          className="rounded-md"
        ></Image>
        <LoginForm />
      </div>
      <div className="mt-2">Copyright © 2025 HRMO Payroll Management</div>
    </div>
  );
};

export default LoginPage;
