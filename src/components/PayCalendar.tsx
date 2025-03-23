"use client";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const PayCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  return (
    <div className="rounded-md bg-white border-2 border-[var(--border)] p-4 text-sm text-[var(--text)]">
      <Calendar onChange={onChange} value={value} />
    </div>
  );
};

export default PayCalendar;
