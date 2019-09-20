import { Equatable } from '@monument/contracts';

/**
 * @implements EqualsFunction
 * @author Alex Chugaev
 * @since 0.0.1
 */
export function EquatableEquals<T extends Equatable<any>>(x: T, y: T): boolean {
  return x.equals(y);
}
