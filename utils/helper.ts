type UniqueKey<T> = keyof T;

export const getTenItems = <T>(array: T[], page: number = 1): T[] => {
  return array.slice(0, page * 10);
};

export function mergeWithoutDuplicates<T extends { Title: string; [key: string]: any }>(
  array1: T[],
  array2: T[],
  uniqueKey: keyof T
): T[] {
  const existingKeys = new Set(array1.map((item) => item[uniqueKey]));

  // Merge without duplicates
  const mergedArray = [...array1, ...array2.filter((item) => !existingKeys.has(item[uniqueKey]))];

  // Sort the merged array by the "Title" key
  return mergedArray.sort((a, b) => a.Title.localeCompare(b.Title));
}
