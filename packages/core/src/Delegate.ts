/**
 * @author Alex Chugaev
 * @since 0.16.0
 */
export type Delegate<A extends ReadonlyArray<any>, R> = (...args: A) => R;
