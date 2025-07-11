import { prisma } from "@/../prisma/prisma";

export const getJobOrderEmployeeStats = async () => {
  // Fetch all departments
  const departments = await prisma.department.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  // Fetch employees in JOB_ORDER category
  const jobOrderEmployees = await prisma.employee.findMany({
    where: {
      category: "JOB_ORDER",
    },
    select: {
      department: true,
    },
  });

  // Count employees per department
  const departmentCounts: Record<string, number> = {};

  for (const emp of jobOrderEmployees) {
    const deptId = emp.department?.toString();
    if (!deptId) continue;
    departmentCounts[deptId] = (departmentCounts[deptId] || 0) + 1;
  }

  // Build chart data
  const chartData = departments
    .filter((dept) => departmentCounts[dept.id])
    .map((dept) => ({
      name: dept.name,
      total: departmentCounts[dept.id] || 0,
    }));

  return chartData;
};
