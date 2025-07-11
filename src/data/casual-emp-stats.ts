import { prisma } from "@/../prisma/prisma";

export const getCasualEmployeeStats = async () => {
  const departments = await prisma.department.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const casualEmployees = await prisma.employee.findMany({
    where: {
      category: "CASUAL",
    },
    select: {
      department: true,
    },
  });

  const departmentCounts: Record<string, number> = {};

  for (const emp of casualEmployees) {
    const deptId = emp.department?.toString();
    if (!deptId) continue;
    departmentCounts[deptId] = (departmentCounts[deptId] || 0) + 1;
  }

  const chartData = departments
    .filter((dept) => departmentCounts[dept.id])
    .map((dept) => ({
      name: dept.name,
      total: departmentCounts[dept.id] || 0,
    }));

  return chartData;
};
