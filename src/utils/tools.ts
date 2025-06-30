const debounce = (fn: Function, delay: number) => {
  let timeoutId: any;
  return (...args: any) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const paginationUtil = (
  items: any[],
  page: number,
  limit: number,
  length: number
) => {
  const startIndex = length ? page * limit + 1 : 0;
  const endIndex = Math.min(startIndex + limit - 1, length);
  return {
    items,
    page: page,
    pages: Math.ceil(length / limit),
    pageSize: endIndex - startIndex + 1,
    pageRange: length,
  };
};

const isArrayEqual = (arr1: any[], arr2: any[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((val, idx) => val === arr2[idx]);
};

export { debounce, paginationUtil, isArrayEqual };
