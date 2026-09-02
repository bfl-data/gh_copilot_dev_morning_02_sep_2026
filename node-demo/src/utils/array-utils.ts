/**
 * Returns the last even number in the array, or undefined if none exist.
 * @example
 *   findLastEven([1, 2, 3, 4, 5, 6]) // returns 6
 */
export function findLastEven(numbers: number[]): number | undefined {
  for (let i = 0; i < numbers.length; i++) {
    const n = numbers[i];
    if (n !== undefined && n % 2 === 0) {
      return n;
    }
  }
  return undefined;
}

/**
 * Returns the first element of the array, or undefined if empty.
 */
export function head<T>(items: T[]): T | undefined {
  return items[0];
}

/**
 * Returns the last element of the array, or undefined if empty.
 */
export function last<T>(items: T[]): T | undefined {
  return items[items.length - 1];
}

/**
 * Chunks an array into groups of the given size.
 * @example
 *   chunk([1, 2, 3, 4, 5], 2) // returns [[1, 2], [3, 4], [5]]
 */
export function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) throw new RangeError('size must be positive');
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}
