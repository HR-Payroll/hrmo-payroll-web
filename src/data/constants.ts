const currentDate = new Date();

export const REGULAR_SCHEDULE = {
  name: "Regular",
  daysIncluded: [1, 2, 3, 4, 5].map((day) => ({
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
