import { prisma } from "@/../prisma/prisma";

export const getRegularEmployeeStats = async () => {
  const departments = await prisma.department.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const regularEmployees = await prisma.employee.findMany({
    where: {
      category: "REGULAR",
    },
    select: {
      department: true,
    },
  });

  const departmentCounts: Record<string, number> = {};

  for (const emp of regularEmployees) {
    const deptId = emp.department?.id.toString();
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
