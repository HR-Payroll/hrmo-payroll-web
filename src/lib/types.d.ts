interface Department {
  id?: number;
  name: string;
  category: string;
  index: string;
  createdAt: Date;
  updatedAt?: Date;
}

interface Employee {
  id?: string;
  recordNo: string;
  name: string;
  category: string;
  departmentId?: number | null;
  scheduleId: number;
  department?: Department;
  schedule?: Schedule;
  rate?: number;
  type?: string;
  createdAt: Date;
  updatedAt?: Date;
}
