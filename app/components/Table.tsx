"use client";
import React from "react";

const Table = ({
  columns,
  data,
  rowRenderer,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  data: any[];
  rowRenderer: (item: any) => React.ReactNode;
}) => {
  return (
    <div className="rounded-md border-2 border-[#ECEEF6] mt-4">
      <table className="w-full text-xs text-center rtl:text-right text-[#333333]">
        <thead className="bg-blue-200">
          <tr>
            {columns.map((col) => (
              <th key={col.accessor} className={col.className}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{data.map(rowRenderer)}</tbody>
      </table>
    </div>
  );
};

export default Table;
