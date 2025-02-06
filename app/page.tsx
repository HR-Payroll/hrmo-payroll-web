import Link from "next/link";

export default function Home() {
  return (
    <main className="w-screen h-screen flex flex-col justify-center items-center gap-6">
      <h1 className="text-neutral-800 text-2xl">
        Welcome to HRMO Payroll Management!
      </h1>
      <Link
        href="/login"
        className="bg-blue-700 rounded-4xl py-2 px-10 border border-blue-700 text-white"
      >
        Log In here
      </Link>
    </main>
  );
}
