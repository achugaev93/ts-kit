import {Collection} from './Collection';
import {IEqualityComparator} from './IEqualityComparator';
import {EqualityComparator} from './EqualityComparator';
import {KeyValuePair} from './KeyValuePair';
import {IKeyValuePair} from './IKeyValuePair';
import {Assert} from '../Assertion/Assert';


export class KeyValueCollection<TKey, TValue> extends Collection<IKeyValuePair<TKey, TValue>> {

    public put(key: TKey, value: TValue): void {
        Assert.argument('key', key).notNull();

        this.add(new KeyValuePair(key, value));
    }


    public removeByKey(
        key: TKey,
        keyComparator: IEqualityComparator<TKey> = EqualityComparator.instance
    ): void {
        Assert.argument('key', key).notNull();
        Assert.argument('keyComparator', keyComparator).notNull();

        for (let entry of this) {
            if (keyComparator.equals(entry.key, key)) {
                this.remove(entry);
                break;
            }
        }
    }


    public removeAllByKey(
        key: TKey,
        keyComparator: IEqualityComparator<TKey> = EqualityComparator.instance
    ): void {
        Assert.argument('key', key).notNull();
        Assert.argument('keyComparator', keyComparator).notNull();

        for (let entry of this) {
            if (keyComparator.equals(entry.key, key)) {
                this.remove(entry);
            }
        }
    }


    public findByKey(
        key: TKey,
        keyComparator: IEqualityComparator<TKey> = EqualityComparator.instance
    ): TValue {
        Assert.argument('key', key).notNull();
        Assert.argument('keyComparator', keyComparator).notNull();

        for (let entry of this) {
            if (keyComparator.equals(entry.key, key)) {
                return entry.value;
            }
        }

        return null;
    }

    /**
     *
     * @param key
     * @param keyComparator
     */
    public findAllByKey(
        key: TKey,
        keyComparator: IEqualityComparator<TKey> = EqualityComparator.instance
    ): Collection<TValue> {
        Assert.argument('key', key).notNull();
        Assert.argument('keyComparator', keyComparator).notNull();

        let values: Collection<TValue> = new Collection<TValue>();

        for (let entry of this) {
            if (keyComparator.equals(entry.key, key)) {
                values.add(entry.value);
            }
        }

        return values;
    }
}
