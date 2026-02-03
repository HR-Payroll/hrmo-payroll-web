"use client";
import { getTotalWorkingDays } from "@/actions/events";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface ReportsDaysDisplayProps {
  from: Date;
  to: Date;
  compact?: boolean;
}

const ReportsDaysDisplay: React.FC<ReportsDaysDisplayProps> = ({
  from,
  to,
  compact = false,
}) => {
  const [totalDays, setTotalDays] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    calculateDays();
  }, [from, to]);

  const calculateDays = async () => {
    try {
      setIsLoading(true);
      const days = await getTotalWorkingDays(from, to);
      setTotalDays(days);
    } catch (error) {
      console.error("Error calculating days:", error);
      setTotalDays(0);
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <Link
        href="/dashboard/settings/holidays"
        className="flex items-center gap-3 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg select-none cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-blue-900">
            Working Days:
          </span>
          {isLoading ? (
            <span className="text-sm text-blue-600">Calculating...</span>
          ) : (
            <span className="text-base font-bold text-blue-600">
              {totalDays}
            </span>
          )}
        </div>
        <div className="text-xs text-blue-600">
          {from.toLocaleDateString("en-US", { month: "short", day: "numeric" })}{" "}
          - {to.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-blue-900">
            Working Days Summary
          </h3>
          <p className="text-sm text-blue-700">
            {from.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
            -{" "}
            {to.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="text-right">
          {isLoading ? (
            <div className="text-blue-600">Calculating...</div>
          ) : (
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {totalDays}
              </div>
              <div className="text-sm text-blue-700">working days</div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-blue-200">
        <p className="text-xs text-blue-600">
          Based on configured monthly working days.
          <a
            href="/dashboard/settings/monthly-days"
            className="underline hover:text-blue-800 ml-1"
          >
            Configure settings
          </a>
        </p>
      </div>
    </div>
  );
};

export default ReportsDaysDisplay;
