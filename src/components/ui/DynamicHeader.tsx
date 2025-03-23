import React from "react";

function DynamicHeader({ label }: { label: string }) {
  return (
    <h1 className="text-base font-semibold text-[var(--text)]">
      Daily Time Record ({label})
    </h1>
  );
}

export default DynamicHeader;
