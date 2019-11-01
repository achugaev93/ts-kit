import { Delegate } from '@monument/core';

export function removeBy<T>(self: Iterable<T>, predicate: Delegate<[T, number], boolean>): Iterable<T> {
  return {
    * [Symbol.iterator](): Iterator<T> {
      let index: number = 0;

      for (const item of self) {
        if (!predicate(item, index)) {
          yield item;
        }

        index++;
      }
    }
  };
}
