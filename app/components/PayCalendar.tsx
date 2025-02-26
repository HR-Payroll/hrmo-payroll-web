"use client";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const PayCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  return (
    <div className="rounded-md bg-white border-2 border-[#ECEEF6] p-4 text-sm text-[#333333]">
      <Calendar onChange={onChange} value={value} />
    </div>
  );
};

export default PayCalendar;
