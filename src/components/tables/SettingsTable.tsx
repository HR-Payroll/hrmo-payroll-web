"use client";
import React, { useState } from "react";
import Link from "next/link";
import SettingsDeptFilter from "../SettingsDeptFilter";
import { MdOutlineEdit } from "react-icons/md";
import { Settings } from "@/types";
import SnackbarInfo, { initialSnackbar } from "../ui/SnackbarInfo";

const SettingsTable = ({
  departments,
  settings,
}: {
  departments: any[];
  settings: Settings;
}) => {
  const [gracePeriod, setGracePeriod] = useState<number>(
    settings.gracePeriod || 10
  );
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "info",
    modal: false,
  });

  const applySettings = async () => {};

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-row bg-white rounded-md border-2 border-[var(--border)]">
        <table>
          <tbody>
            <tr>
              <td>Working Hours:</td>
              <td className="flex flex-col sm:flex-row items-center gap-x-3">
                <div className="flex flex-row items-center justify-center rounded-md border-2 border-[var(--border)]">
                  <input
                    type="number"
                    placeholder="40"
                    className="w-[40px] appearance-none outline-none px-2"
                  />
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
              <td className="flex flex-col sm:flex-row items-center gap-x-3">
                <div className="flex flex-row items-center justify-center rounded-md border-2 border-[var(--border)]">
                  <input
                    type="number"
                    defaultValue={gracePeriod}
                    className="w-[40px] appearance-none outline-none px-2"
                    onChange={(e) => setGracePeriod(Number(e.target.value))}
                  />
                  <span className="bg-[var(--border)] py-1 px-2">mins</span>
                </div>
                for
                <SettingsDeptFilter departments={departments} />
              </td>
            </tr>
            <tr>
              <td>Breaks:</td>
              <td className="flex flex-col sm:flex-row items-center gap-x-3">
                <span className="flex flex-row gap-x-2">
                  <h1>Automatically Apply Breaks</h1>
                  <input type="checkbox" className="cursor-pointer" />
                </span>
                <h1>Apply Breaks After</h1>
                <div className="flex flex-row items-center justify-center rounded-md border-2 border-[var(--border)]">
                  <input
                    type="number"
                    placeholder="4"
                    className="w-[40px] appearance-none outline-none px-2"
                  />
                  <span className="bg-[var(--border)] py-1 px-2">hrs</span>
                </div>
                <h1>Apply Breaks Of</h1>
                <div className="flex flex-row items-center justify-center rounded-md border-2 border-[var(--border)]">
                  <input
                    type="number"
                    placeholder="60"
                    className="w-[40px] appearance-none outline-none px-2"
                  />
                  <span className="bg-[var(--border)] py-1 px-2">min</span>
                </div>
              </td>
            </tr>
            <tr>
              <td>Overtime:</td>
              <td className="flex flex-col sm:flex-row items-center gap-x-3">
                <span className="flex flex-row gap-x-2">
                  <h1>Automatically Apply Overtime Pay</h1>
                  <input type="checkbox" className="cursor-pointer" />
                </span>
                for
                <SettingsDeptFilter departments={departments} />
              </td>
            </tr>
            <tr>
              <td className="content-start">Allowances:</td>
              <td className="flex flex-col items-start gap-y-4">
                <span className="flex flex-col sm:flex-row items-center gap-x-2">
                  <input
                    type="checkbox"
                    className="items-center cursor-pointer"
                  />
                  <h1>ACA/PERA</h1>
                  for
                  <SettingsDeptFilter departments={departments} />
                </span>
                <span className="flex flex-col sm:flex-row items-center gap-x-2">
                  <input
                    type="checkbox"
                    className="items-center cursor-pointer"
                  />
                  <h1>RATA</h1>
                  for
                  <SettingsDeptFilter departments={departments} />
                </span>
                <span className="flex flex-col sm:flex-row items-center gap-x-2">
                  <input
                    type="checkbox"
                    className="items-center cursor-pointer"
                  />
                  <h1>Mobile</h1>
                  for
                  <SettingsDeptFilter departments={departments} />
                </span>
              </td>
            </tr>
            <tr>
              <td className="content-start">Leave Benefits:</td>
              <td className="flex flex-col items-start gap-y-4">
                <span className="flex flex-col sm:flex-row items-center gap-x-2">
                  <input
                    type="checkbox"
                    className="items-center cursor-pointer"
                  />
                  <h1>Apply Vacation Leave Benefits</h1>
                  for
                  <SettingsDeptFilter departments={departments} />
                </span>
                <span className="flex flex-col sm:flex-row items-center gap-x-2">
                  <input
                    type="checkbox"
                    className="items-center cursor-pointer"
                  />
                  <h1>Apply Sick Leave Benefits</h1>
                  for
                  <SettingsDeptFilter departments={departments} />
                </span>
                <span className="flex flex-col sm:flex-row items-center gap-x-2">
                  <input
                    type="checkbox"
                    className="items-center cursor-pointer"
                  />
                  <h1>Apply Business Trip Leave Benefits</h1>
                  for
                  <SettingsDeptFilter departments={departments} />
                </span>
                <span className="flex flex-col sm:flex-row items-center gap-x-2">
                  <input
                    type="checkbox"
                    className="items-center cursor-pointer"
                  />
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
          </tbody>
        </table>
      </div>
      <div className="flex flex-row gap-x-4 items-center justify-end font-semibold mt-4 px-4">
        <button className="rounded-md bg-blue-200 hover:bg-blue-300 active:bg-blue-400 active:text-white py-2 px-6 text-[var(--accent)] cursor-pointer">
          Apply
        </button>
        <button className="rounded-md bg-[var(--border)] hover:bg-slate-300 active:bg-slate-400 active:text-white py-2 px-6 cursor-pointer">
          Cancel
        </button>
      </div>
      {snackbar.modal && (
        <SnackbarInfo
          isOpen={snackbar.modal}
          type={snackbar.type as any}
          message={snackbar.message}
          onClose={() => {
            setSnackbar(initialSnackbar);
          }}
        />
      )}
    </div>
  );
};

export default SettingsTable;
