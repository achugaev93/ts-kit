

export interface ICloneable<T> {
    /**
     * Creates new object that is a copy of the current instance.
     */
    clone(): T;
}
