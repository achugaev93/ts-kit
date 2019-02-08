import { RuntimeException } from './RuntimeException';

/**
 * @author Alex Chugaev
 * @since 0.0.1
 */
export class MethodNotImplementedException extends RuntimeException {
    public constructor(methodName: string) {
        super(`Method '${methodName}' is not implemented.`);
    }
}
