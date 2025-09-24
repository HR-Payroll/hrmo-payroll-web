export interface Settings {
  id?: string;
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

export interface Schedule {
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
