import PageInfo from "@/components/PageInfo";
import Link from "next/link";
import React from "react";
import Calendar from "react-calendar";
import { MdArrowBackIosNew, MdOutlineCheck } from "react-icons/md";

const HolidaysSettingsPage = () => {
  return (
    <div className="w-full flex flex-col bg-white rounded-md border-2 border-[var(--border)] text-[var(--text)] text-sm gap-4 p-4">
      <div className="absolute top-4 -ml-4">
        <PageInfo
          title="Settings"
          info="Adjust your pay register system in this page."
        />
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={`/dashboard/settings`}
          className="rounded-full bg-[var(--border)] hover:bg-blue-200 active:bg-blue-300 active:text-[var(--accent)] text-[var(--text)] p-2 cursor-pointer"
        >
          <MdArrowBackIosNew size={12} />
        </Link>
        <h1 className="text-base font-semibold">Holidays Settings</h1>
      </div>
      <div className="flex flex-row gap-x-8">
        <div className="w-fit flex flex-col gap-y-4">
          <h1 className="font-semibold">Regular Holidays</h1>
          <div className="flex items-center justify-center rounded-md border-2 border-[var(--border)]">
            <input
              type="text"
              placeholder="Holiday 1"
              className="w-[200px] outline-none px-2"
            ></input>
            <button className="bg-[var(--border)] hover:bg-blue-200 active:bg-blue-300 active:text-[var(--accent)] text-[var(--text)] py-1.5 px-2 cursor-pointer">
              <MdOutlineCheck />
            </button>
          </div>
          <div className="flex items-center justify-center rounded-md border-2 border-[var(--border)]">
            <input
              type="text"
              placeholder="Holiday 1"
              className="w-[200px] outline-none px-2"
            ></input>
            <button className="bg-[var(--border)] hover:bg-blue-200 active:bg-blue-300 active:text-[var(--accent)] text-[var(--text)] py-1.5 px-2 cursor-pointer">
              <MdOutlineCheck />
            </button>
          </div>
          <div className="flex items-center justify-center rounded-md border-2 border-[var(--border)]">
            <input
              type="text"
              placeholder="Holiday 1"
              className="w-[200px] outline-none px-2"
            ></input>
            <button className="bg-[var(--border)] hover:bg-blue-200 active:bg-blue-300 active:text-[var(--accent)] text-[var(--text)] py-1.5 px-2 cursor-pointer">
              <MdOutlineCheck />
            </button>
          </div>
          <div className="flex items-center justify-center rounded-md border-2 border-[var(--border)]">
            <input
              type="text"
              placeholder="Holiday 1"
              className="w-[200px] outline-none px-2"
            ></input>
            <button className="bg-[var(--border)] hover:bg-blue-200 active:bg-blue-300 active:text-[var(--accent)] text-[var(--text)] py-1.5 px-2 cursor-pointer">
              <MdOutlineCheck />
            </button>
          </div>
          <div className="flex items-center justify-center rounded-md border-2 border-[var(--border)]">
            <input
              type="text"
              placeholder="Holiday 1"
              className="w-[200px] outline-none px-2"
            ></input>
            <button className="bg-[var(--border)] hover:bg-blue-200 active:bg-blue-300 active:text-[var(--accent)] text-[var(--text)] py-1.5 px-2 cursor-pointer">
              <MdOutlineCheck />
            </button>
          </div>
          <div className="flex items-center justify-center rounded-md border-2 border-[var(--border)]">
            <input
              type="text"
              placeholder="Holiday 1"
              className="w-[200px] outline-none px-2"
            ></input>
            <button className="bg-[var(--border)] hover:bg-blue-200 active:bg-blue-300 active:text-[var(--accent)] text-[var(--text)] py-1.5 px-2 cursor-pointer">
              <MdOutlineCheck />
            </button>
          </div>
          <div className="flex items-center gap-x-2">
            <input type="checkbox"></input>
            <h1 className="font-semibold">Apply All</h1>
          </div>
        </div>
        <div className="w-fit flex flex-col gap-y-4">
          <h1 className="font-semibold">Special (Non-Working) Holidays</h1>
          <div className="flex items-center justify-center rounded-md border-2 border-[var(--border)]">
            <input
              type="text"
              placeholder="Holiday 1"
              className="w-[200px] outline-none px-2"
            ></input>
            <button className="bg-[var(--border)] hover:bg-blue-200 active:bg-blue-300 active:text-[var(--accent)] text-[var(--text)] py-1.5 px-2 cursor-pointer">
              <MdOutlineCheck />
            </button>
          </div>
          <div className="flex items-center justify-center rounded-md border-2 border-[var(--border)]">
            <input
              type="text"
              placeholder="Holiday 1"
              className="w-[200px] outline-none px-2"
            ></input>
            <button className="bg-[var(--border)] hover:bg-blue-200 active:bg-blue-300 active:text-[var(--accent)] text-[var(--text)] py-1.5 px-2 cursor-pointer">
              <MdOutlineCheck />
            </button>
          </div>
          <div className="flex items-center justify-center rounded-md border-2 border-[var(--border)]">
            <input
              type="text"
              placeholder="Holiday 1"
              className="w-[200px] outline-none px-2"
            ></input>
            <button className="bg-[var(--border)] hover:bg-blue-200 active:bg-blue-300 active:text-[var(--accent)] text-[var(--text)] py-1.5 px-2 cursor-pointer">
              <MdOutlineCheck />
            </button>
          </div>
          <div className="flex items-center justify-center rounded-md border-2 border-[var(--border)]">
            <input
              type="text"
              placeholder="Holiday 1"
              className="w-[200px] outline-none px-2"
            ></input>
            <button className="bg-[var(--border)] hover:bg-blue-200 active:bg-blue-300 active:text-[var(--accent)] text-[var(--text)] py-1.5 px-2 cursor-pointer">
              <MdOutlineCheck />
            </button>
          </div>
          <div className="flex items-center justify-center rounded-md border-2 border-[var(--border)]">
            <input
              type="text"
              placeholder="Holiday 1"
              className="w-[200px] outline-none px-2"
            ></input>
            <button className="bg-[var(--border)] hover:bg-blue-200 active:bg-blue-300 active:text-[var(--accent)] text-[var(--text)] py-1.5 px-2 cursor-pointer">
              <MdOutlineCheck />
            </button>
          </div>
          <div className="flex items-center justify-center rounded-md border-2 border-[var(--border)]">
            <input
              type="text"
              placeholder="Holiday 1"
              className="w-[200px] outline-none px-2"
            ></input>
            <button className="bg-[var(--border)] hover:bg-blue-200 active:bg-blue-300 active:text-[var(--accent)] text-[var(--text)] py-1.5 px-2 cursor-pointer">
              <MdOutlineCheck />
            </button>
          </div>
          <div className="flex items-center gap-x-2">
            <input type="checkbox"></input>
            <h1 className="font-semibold">Apply All</h1>
          </div>
        </div>
        {/* Dummy Calendar */}
        <div className="w-auto">
          <Calendar />
        </div>
      </div>
      <div className="flex flex-row gap-x-4 items-center justify-end font-semibold mt-4">
        <button className="rounded-md bg-blue-200 hover:bg-blue-300 active:bg-blue-400 active:text-white py-2 px-6 text-[var(--accent)] cursor-pointer">
          Apply
        </button>
        <button className="rounded-md bg-[var(--border)] hover:bg-slate-300 active:bg-slate-400 active:text-white py-2 px-6 cursor-pointer">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default HolidaysSettingsPage;
