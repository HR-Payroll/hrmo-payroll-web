"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { MdArrowBackIosNew } from "react-icons/md";

function BackButton({ to }: { to: string }) {
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const generateLink = (): string => {
    let url = to;
    const params = Object.fromEntries(searchParams.entries());

    Object.keys(params).forEach((key, index) => {
      if (index === 0) url += `?${key}=${params[key]}`;
      else url += `&${key}=${params[key]}`;
    });

    return url;
  };
  return (
    <Link
      href={generateLink()}
      className="rounded-full bg-[var(--border)] hover:bg-blue-200 active:bg-blue-300 active:text-[var(--accent)] text-[var(--text)] p-2 cursor-pointer"
    >
      <MdArrowBackIosNew size={12} />
    </Link>
  );
}

export default BackButton;
