/**
 * Returns the last even number in the array, or undefined if none exist.
 * @example
 *   findLastEven([1, 2, 3, 4, 5, 6]) // returns 6
 */
export function findLastEven(numbers: number[]): number | undefined {
  for (let i = numbers.length - 1; i >= 0; i--) {
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
 * Returns the first item matching the predicate, or undefined when none match.
 * @param items - The items to search.
 * @param predicate - Determines whether an item matches.
 * @returns The first matching item, or undefined.
 * @example
 *   findItem([1, 2, 3], (item) => item > 1) // returns 2
 */
export function findItem<T>(items: T[], predicate: (item: T) => boolean): T | undefined {
  return items.find(predicate);
}

/**
 * Chunks an array into groups of the given size.
 * @param items - The items to divide into chunks.
 * @param size - The positive integer maximum number of items per chunk.
 * @returns A new array containing the chunks.
 * @throws {RangeError} When size is not a positive integer.
 * @example
 *   chunk([1, 2, 3, 4, 5], 2) // returns [[1, 2], [3, 4], [5]]
 */
export function chunk<T>(items: T[], size: number): T[][] {
  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError('size must be a positive integer');
  }
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}
