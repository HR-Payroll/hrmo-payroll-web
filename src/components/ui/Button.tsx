import React from "react";

function Button({
  label,
  type,
  isLoading,
}: {
  label: string;
  type?: "submit" | "reset" | "button";
  isLoading: boolean;
}) {
  return (
    <button
      type={type}
      disabled={isLoading}
      className="w-full rounded-md bg-blue-200 hover:bg-blue-300 text-[#0000ff] active:text-white text-xs font-semibold py-2 cursor-pointer disabled:opacity-50"
    >
      {label}
    </button>
  );
}

export default Button;
