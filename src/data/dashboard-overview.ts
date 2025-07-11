import { prisma } from "@/../prisma/prisma";
import { startOfMonth, subMonths, endOfMonth } from "date-fns";

export const getDashboardOverview = async () => {
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const departmentCount = await prisma.department.count();
  const totalRegular = await prisma.employee.count({ where: { category: "REGULAR" } });
  const totalCasual = await prisma.employee.count({ where: { category: "CASUAL" } });
  const totalJobOrder = await prisma.employee.count({ where: { category: "JOB_ORDER" } });

  const currentMonthDepartments = await prisma.department.count({
    where: {
      createdAt: { gte: currentMonthStart, lte: now },
    },
  });

  const lastMonthDepartments = await prisma.department.count({
    where: {
      createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
    },
  });

  const currentRegular = await prisma.employee.count({
    where: {
      category: "REGULAR",
      createdAt: { gte: currentMonthStart, lte: now },
    },
  });
  const lastRegular = await prisma.employee.count({
    where: {
      category: "REGULAR",
      createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
    },
  });

  const currentCasual = await prisma.employee.count({
    where: {
      category: "CASUAL",
      createdAt: { gte: currentMonthStart, lte: now },
    },
  });
  const lastCasual = await prisma.employee.count({
    where: {
      category: "CASUAL",
      createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
    },
  });

  const currentJobOrder = await prisma.employee.count({
    where: {
      category: "JOB_ORDER",
      createdAt: { gte: currentMonthStart, lte: now },
    },
  });
  const lastJobOrder = await prisma.employee.count({
    where: {
      category: "JOB_ORDER",
      createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
    },
  });

  const percent = (curr: number, prev: number) => {
    if (prev === 0) return curr === 0 ? "+0%" : "+100%";
    const diff = ((curr - prev) / prev) * 100;
    const sign = diff >= 0 ? "+" : "";
    return `${sign}${diff.toFixed(1)}%`;
  };

  return {
    departments: {
      value: departmentCount,
      growth: `${percent(currentMonthDepartments, lastMonthDepartments)} from last month`,
    },
    regular: {
      value: totalRegular,
      growth: `${percent(currentRegular, lastRegular)} from last month`,
    },
    casual: {
      value: totalCasual,
      growth: `${percent(currentCasual, lastCasual)} from last month`,
    },
    jobOrder: {
      value: totalJobOrder,
      growth: `${percent(currentJobOrder, lastJobOrder)} from last month`,
    },
  };
};
