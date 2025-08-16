const currentDate = new Date();

export const REGULAR_SCHEDULE = {
  name: "Regular",
  daysIncluded: [0, 1, 2, 3, 4, 5, 6].map((day) => ({
    value: day,
    inTime: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      8,
      0,
      0
    ),
    outTime: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      17,
      0,
      0
    ),
    included: true,
  })),
  option: "Regular",
};
