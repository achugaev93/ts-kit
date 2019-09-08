import { InvalidOperationException } from '@monument/core';

/**
 * @author Alex Chugaev
 * @since 0.0.1
 */
export class EmptyStackException extends InvalidOperationException {
  constructor() {
    super('Unable to perform operation on empty stack.');
  }
}
