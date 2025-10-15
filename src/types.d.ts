export interface Settings {
  id?: number;
  syncHolidays: string;
  gracePeriod?: number;
}

export interface ScheduleDay {
  label: string;
  value: number;
  inTime: string;
  outTime: string;
  included?: boolean;
  type?: "IN" | "OUT";
}

interface Schedule {
  id?: number;
  name: string;
  daysIncluded: ScheduleDay[];
  readOnly: boolean;
  option: string;
  straightTimeRegular?: boolean;
}

export type DaysKey =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type Days = {
  Sunday: {
    value: 0;
    inTime: regularIn;
    outTime: regularOut;
    included: true;
  };
  Monday: {
    value: 1;
    inTime: regularIn;
    outTime: regularOut;
    included: true;
  };
  Tuesday: {
    value: 2;
    inTime: regularIn;
    outTime: regularOut;
    included: true;
  };
  Wednesday: {
    value: 3;
    inTime: regularIn;
    outTime: regularOut;
    included: true;
  };
  Thursday: {
    value: 4;
    inTime: regularIn;
    outTime: regularOut;
    included: true;
  };
  Friday: {
    value: 5;
    inTime: regularIn;
    outTime: regularOut;
    included: true;
  };
  Saturday: {
    value: 6;
    inTime: regularIn;
    outTime: regularOut;
    included: true;
  };
};

export interface User {
  id: number;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  id: number;
  index: string;
  name: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  employees?: Employee[];
}

export interface Employee {
  id: number;
  recordNo: string;
  name: string;
  category: Category;
  departmentId?: number | null;
  rate?: number | null;
  type?: string | null;
  scheduleId?: number | null;
  gsisgs?: number | null;
  ec?: number | null;
  gsisps?: number | null;
  phic?: number | null;
  hdmfgs?: number | null;
  hdmfps?: number | null;
  wtax?: number | null;
  sss?: number | null;
  mplhdmf?: number | null;
  gfal?: number | null;
  landbank?: number | null;
  cb?: number | null;
  eml?: number | null;
  mplgsis?: number | null;
  tagum?: number | null;
  ucpb?: number | null;
  mpllite?: number | null;
  sb?: number | null;
  createdAt: Date;
  updatedAt: Date;
  department?: Department | null;
  schedule?: Schedule | null;
}

export interface Report {
  id: number;
  index: string;
  recordNo: string;
  name: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt?: Date | null;
}
