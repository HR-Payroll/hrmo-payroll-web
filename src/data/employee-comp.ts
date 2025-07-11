import { prisma } from "@/../prisma/prisma";

export const getEmployeeComposition = async () => {
  const [regularCount, casualCount, jobOrderCount] = await Promise.all([
    prisma.employee.count({ where: { category: "REGULAR" } }),
    prisma.employee.count({ where: { category: "CASUAL" } }),
    prisma.employee.count({ where: { category: "JOB_ORDER" } }),
  ]);

  return [
    { name: "Regular", value: regularCount },
    { name: "Casual", value: casualCount },
    { name: "Job Order", value: jobOrderCount },
  ];
};
