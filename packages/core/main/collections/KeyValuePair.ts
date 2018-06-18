import {EqualityComparator} from '../EqualityComparator';


export class KeyValuePair<K, V> {
    public readonly key: K;
    public readonly value: V;


    public constructor(key: K, value: V) {
        this.key = key;
        this.value = value;
    }


    public setKey(newKey: K): KeyValuePair<K, V> {
        return new KeyValuePair(newKey, this.value);
    }


    public setValue(newValue: V): KeyValuePair<K, V> {
        return new KeyValuePair(this.key, newValue);
    }


    public equals(
        other: KeyValuePair<K, V>,
        keyComparator: EqualityComparator<K>,
        valueComparator: EqualityComparator<V>
    ): boolean {
        return keyComparator.equals(this.key, other.key) && valueComparator.equals(this.value, other.value);
    }
}
