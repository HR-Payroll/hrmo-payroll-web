"use client";
import React from "react";
import SettingsDeptFilter from "../SettingsDeptFilter";
import { MdOutlineEdit } from "react-icons/md";
import Link from "next/link";

const SettingsTable = ({ departments }: { departments: any[] }) => {
  return (
    <div>
      <div className="w-full flex flex-row bg-white rounded-md border-2 border-[var(--border)]">
        <table>
          <tr>
            <td>Working Hours:</td>
            <td className="flex flex-row items-center gap-x-4">
              <div className="flex flex-row items-center justify-center rounded-md border-2 border-[var(--border)]">
                <input
                  type="number"
                  placeholder="40"
                  className="w-[40px] appearance-none outline-none px-2"
                ></input>
                <span className="bg-[var(--border)] py-1 px-2">hrs</span>
              </div>
              per
              <select
                defaultValue="Week"
                className="w-[100px] outline-none rounded-md border-2 border-[var(--border)] py-1 px-2"
              >
                <option>Day</option>
                <option>Week</option>
                <option>Month</option>
                <option>Year</option>
              </select>
              for
              <SettingsDeptFilter departments={departments} />
            </td>
          </tr>
          <tr>
            <td>Grace Period:</td>
            <td className="flex flex-row items-center gap-x-4">
              <div className="flex flex-row items-center justify-center rounded-md border-2 border-[var(--border)]">
                <input
                  type="number"
                  placeholder="10"
                  className="w-[40px] appearance-none outline-none px-2"
                ></input>
                <span className="bg-[var(--border)] py-1 px-2">mins</span>
              </div>
              for
              <SettingsDeptFilter departments={departments} />
            </td>
          </tr>
          <tr>
            <td>Breaks:</td>
            <td className="flex flex-row items-center gap-x-4">
              <span className="flex flex-row gap-x-2">
                <h1>Automatically Apply Breaks</h1>
                <input type="checkbox" className="cursor-pointer"></input>
              </span>
              <h1>Apply Breaks After</h1>
              <div className="flex flex-row items-center justify-center rounded-md border-2 border-[var(--border)]">
                <input
                  type="number"
                  placeholder="4"
                  className="w-[40px] appearance-none outline-none px-2"
                ></input>
                <span className="bg-[var(--border)] py-1 px-2">hrs</span>
              </div>
              <h1>Apply Breaks Of</h1>
              <div className="flex flex-row items-center justify-center rounded-md border-2 border-[var(--border)]">
                <input
                  type="number"
                  placeholder="60"
                  className="w-[40px] appearance-none outline-none px-2"
                ></input>
                <span className="bg-[var(--border)] py-1 px-2">min</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>Overtime:</td>
            <td className="flex flex-row items-center gap-x-4">
              <span className="flex flex-row gap-x-2">
                <h1>Automatically Apply Overtime Pay</h1>
                <input type="checkbox" className="cursor-pointer"></input>
              </span>
              for
              <SettingsDeptFilter departments={departments} />
            </td>
          </tr>
          <tr>
            <td>Holidays:</td>
            <td>
              <Link
                href={`/dashboard/settings/holidays`}
                className="flex items-center gap-x-1"
              >
                <MdOutlineEdit
                  size={24}
                  className="rounded-full hover:bg-blue-100 active:bg-blue-200 active:text-[var(--accent)] p-1 cursor-pointer"
                />
                Edit Holidays
              </Link>
            </td>
          </tr>
          <tr>
            <td className="content-start">Allowances:</td>
            <td className="flex flex-col items-start gap-y-4">
              <span className="flex flex-row items-center gap-x-2">
                <input
                  type="checkbox"
                  className="items-center cursor-pointer"
                ></input>
                <h1>ACA/PERA</h1>
                for
                <SettingsDeptFilter departments={departments} />
              </span>
              <span className="flex flex-row items-center gap-x-2">
                <input
                  type="checkbox"
                  className="items-center cursor-pointer"
                ></input>
                <h1>RATA</h1>
                for
                <SettingsDeptFilter departments={departments} />
              </span>
              <span className="flex flex-row items-center gap-x-2">
                <input
                  type="checkbox"
                  className="items-center cursor-pointer"
                ></input>
                <h1>Mobile</h1>
                for
                <SettingsDeptFilter departments={departments} />
              </span>
            </td>
          </tr>
          <tr>
            <td className="content-start">Leave Benefits:</td>
            <td className="flex flex-col items-start gap-y-4">
              <span className="flex flex-row items-center gap-x-2">
                <input
                  type="checkbox"
                  className="items-center cursor-pointer"
                ></input>
                <h1>Apply Vacation Leave Benefits</h1>
                for
                <SettingsDeptFilter departments={departments} />
              </span>
              <span className="flex flex-row items-center gap-x-2">
                <input
                  type="checkbox"
                  className="items-center cursor-pointer"
                ></input>
                <h1>Apply Sick Leave Benefits</h1>
                for
                <SettingsDeptFilter departments={departments} />
              </span>
              <span className="flex flex-row items-center gap-x-2">
                <input
                  type="checkbox"
                  className="items-center cursor-pointer"
                ></input>
                <h1>Apply Business Trip Leave Benefits</h1>
                for
                <SettingsDeptFilter departments={departments} />
              </span>
              <span className="flex flex-row items-center gap-x-2">
                <input
                  type="checkbox"
                  className="items-center cursor-pointer"
                ></input>
                <h1>Apply Maternal Leave Benefits</h1>
                for
                <SettingsDeptFilter departments={departments} />
              </span>
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default SettingsTable;
