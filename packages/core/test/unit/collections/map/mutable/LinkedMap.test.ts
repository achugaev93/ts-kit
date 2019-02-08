import { EqualityComparator, KeyValuePair, LinkedMap } from '../../../../..';
import { testMap } from './Map.spec';

describe('LinkedMap', function() {
    function create<K, V>(
        items?: Iterable<KeyValuePair<K, V>>,
        keyComparator?: EqualityComparator<K>,
        valueComparator?: EqualityComparator<V>
    ): LinkedMap<K, V> {
        return new LinkedMap(items, keyComparator, valueComparator);
    }

    testMap(create);
});
