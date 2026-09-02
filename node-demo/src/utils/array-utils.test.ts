import { describe, expect, it } from 'vitest';
import { findItem } from './array-utils.js';

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