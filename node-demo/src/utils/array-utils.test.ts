import { describe, expect, it } from 'vitest';
import { chunk, findItem } from './array-utils.js';

describe('findItem', () => {
  it('returns the first item that matches the predicate', () => {
    // Arrange
    const items = [3, 8, 12, 16];

    // Act
    const result = findItem(items, (item) => item % 4 === 0);

    // Assert
    expect(result).toBe(8);
  });

  it('returns undefined when no item matches the predicate', () => {
    // Arrange
    const items = [1, 3, 5];

    // Act
    const result = findItem(items, (item) => item % 2 === 0);

    // Assert
    expect(result).toBeUndefined();
  });

  it('returns undefined for an empty array', () => {
    // Arrange
    const items: string[] = [];

    // Act
    const result = findItem(items, (item) => item === 'target');

    // Assert
    expect(result).toBeUndefined();
  });
});

describe('chunk', () => {
  it('divides items into chunks and preserves a smaller final chunk', () => {
    // Arrange
    const items = [1, 2, 3, 4, 5];

    // Act
    const result = chunk(items, 2);

    // Assert
    expect(result).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('throws a RangeError when size is zero', () => {
    // Arrange
    const items = [1, 2, 3];

    // Act
    const act = () => chunk(items, 0);

    // Assert
    expect(act).toThrow(new RangeError('size must be a positive integer'));
  });

  it('throws a RangeError when size is not a finite integer', () => {
    // Arrange
    const items = [1, 2, 3];

    // Act
    const act = () => chunk(items, Number.NaN);

    // Assert
    expect(act).toThrow(new RangeError('size must be a positive integer'));
  });
});