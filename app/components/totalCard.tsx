import React, { JSX } from "react";

const TotalCard = ({
  type,
  icon,
  value,
  growth,
}: {
  type: string;
  icon: JSX.Element;
  value: number;
  growth: string;
}) => {
  return (
    <div className="flex-1 rounded-md bg-white border-2 border-[#ECEEF6] p-4 text-[#333333]">
      <div className="justify-self-start pb-2 text-xs">
        <p>{type}</p>
      </div>
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-2xl font-medium">{value}</h1>
        <span className="p-2 rounded-full bg-blue-100 text-xl text-blue-500">
          {icon}
        </span>
      </div>
      <div className="mt-4 p-1 rounded-full bg-green-100 text-[10px] text-[#008000]">
        <p>{growth}</p>
      </div>
    </div>
  );
};

export default TotalCard;
