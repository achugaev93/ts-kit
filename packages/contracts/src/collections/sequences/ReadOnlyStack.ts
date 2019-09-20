import { ReadOnlyCollection } from './ReadOnlyCollection';
import { Equatable } from '../../data/Equatable';

/**
 * @author Alex Chugaev
 * @since 0.0.1
 * @readonly
 */
export interface ReadOnlyStack<T> extends ReadOnlyCollection<T>, Equatable<ReadOnlyStack<T>> {
  /**
   * @throws {EmptyStackException}
   */
  peek(): T;
}
