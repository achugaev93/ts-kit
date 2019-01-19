import {ToArray} from '../../base/ToArray';
import {Sequence} from '../../base/Sequence';
import {KeyValuePair} from '../../base/KeyValuePair';
import {ReadOnlyMap} from '../../map/readonly/ReadOnlyMap';
import {SupplyFunction} from '../../../function/SupplyFunction';
import {Equatable} from '../../../comparison/equality/Equatable';

/**
 * @author Alex Chugaev
 * @since 0.0.1
 * @readonly
 */
export interface ReadOnlyMultiValueMap<K, V> extends
    Sequence<KeyValuePair<K, V>>,
    ToArray<KeyValuePair<K, V>>,
    Equatable<ReadOnlyMultiValueMap<K, V>> {

    readonly isEmpty: boolean;
    readonly keys: Iterable<K>;
    readonly values: Iterable<V>;
    readonly valuesCount: number;

    containsEntries(entries: Iterable<KeyValuePair<K, V>>): boolean;

    containsEntry(key: K, value: V): boolean;

    containsKey(key: K): boolean;

    containsKeys(keys: Iterable<K>): boolean;

    containsValue(value: V): boolean;

    containsValues(values: Iterable<V>): boolean;

    get(key: K): Iterable<V>;

    getFirst(key: K): V | undefined;

    getFirst(key: K, fallback: SupplyFunction<V>): V;

    keyOf(value: V): K | undefined;

    keysOf(value: V): Iterable<K>;

    toSingleValueMap(): ReadOnlyMap<K, V>;
}
