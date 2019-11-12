import { Delegate } from '@monument/core';
import { InvalidOperationException } from '@monument/exceptions';

export function all<T>(self: Iterable<T>, predicate: Delegate<[T, number], boolean>): boolean {
  let index = 0;

  for (const item of self) {
    if (!predicate(item, index)) {
      return false;
    }

    index++;
  }

  if (index === 0) {
    throw new InvalidOperationException(`Operation is not allowed for empty iterable`);
  }

  return true;
}
