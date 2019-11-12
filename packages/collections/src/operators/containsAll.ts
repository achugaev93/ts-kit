import { StrictEquals } from '@monument/comparison';
import { Delegate } from '@monument/core';
import { contains } from './contains';

export function containsAll<T>(self: Iterable<T>, items: Iterable<T>): boolean;
export function containsAll<T>(self: Iterable<T>, items: Iterable<T>, equals: Delegate<[T, T], boolean>): boolean;
export function containsAll<T>(self: Iterable<T>, items: Iterable<T>, equals: Delegate<[T, T], boolean> = StrictEquals): boolean {
  let empty = true;

  for (const item of items) {
    empty = false;

    if (!contains(self, item, equals)) {
      return false;
    }
  }

  return !empty;
}
