import { ToString } from '@monument/core';
import { ReadOnlyMultiValueMap } from '@monument/collections';

/**
 * @since 0.0.1
 * @author Alex Chugaev
 * @readonly
 */
export interface ReadOnlyQueryParameters extends ReadOnlyMultiValueMap<string, ToString> {
  getBoolean(key: string): boolean | undefined;

  getBoolean(key: string, defaultValue: boolean): boolean;

  getFloat(key: string): number | undefined;

  getFloat(key: string, defaultValue: number): number;

  getFloats(key: string): Iterable<number>;

  getInteger(key: string): number | undefined;

  getInteger(key: string, defaultValue: number): number;

  getIntegers(key: string): Iterable<number>;

  getString(key: string): string | undefined;

  getString(key: string, defaultValue: string): string;

  getStrings(key: string): Iterable<string>;
}
