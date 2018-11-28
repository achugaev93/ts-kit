import {Queryable} from './Queryable';
import {AggregateFunction} from './AggregateFunction';
import {IteratorFunction} from './IteratorFunction';
import {EqualityComparator} from '../../comparison/equality/EqualityComparator';
import {Grouping} from './Grouping';
import {CombineFunction} from './CombineFunction';
import {SelectorFunction} from './SelectorFunction';
import {Comparator} from '../../comparison/order/Comparator';
import {SortOrder} from '../../comparison/order/SortOrder';
import {InvalidOperationException} from '../../exceptions/InvalidOperationException';
import {StrictEqualityComparator} from '../../comparison/equality/StrictEqualityComparator';
import {CollectionUtils} from './CollectionUtils';
import {IndexOutOfBoundsException} from '../../exceptions/IndexOutOfBoundsException';
import {NoSuchItemException} from './NoSuchItemException';
import {RandomInt} from '../../random/RandomInt';
import {InvalidArgumentException} from '../../exceptions/InvalidArgumentException';


export class QueryableImpl<T> implements Queryable<T> {
    private readonly _source: Iterable<T>;

    public get length(): number {
        let length: number = 0;

        for (const _ of this) {
            length++;
        }

        return length;
    }

    public get isEmpty(): boolean {
        for (const _ of this) {
            return false;
        }

        return true;
    }

    public constructor(source: Iterable<T>) {
        this._source = source;

    }

    public [Symbol.iterator](): Iterator<T> {
        return this._source[Symbol.iterator]();
    }

    public aggregate<TAggregate>(iterator: AggregateFunction<T, TAggregate>, initialSeed: TAggregate): TAggregate {
        let lastSeed: TAggregate = initialSeed;

        this.forEach((actualItem, index) => {
            lastSeed = iterator(lastSeed, actualItem, index);
        });

        return lastSeed;
    }

    public all(predicate: IteratorFunction<T, boolean>): boolean {
        if (this.isEmpty) {
            throw new InvalidOperationException(`Operation is not allowed for empty lists.`);
        }

        let index: number = 0;

        for (const item of this) {
            if (!predicate(item, index)) {
                return false;
            }

            index++;
        }

        return true;
    }

    public any(predicate: IteratorFunction<T, boolean>): boolean {
        if (this.isEmpty) {
            throw new InvalidOperationException(`Operation is not allowed for empty lists.`);
        }

        let index: number = 0;

        for (const item of this) {
            if (predicate(item, index)) {
                return true;
            }

            index++;
        }

        return false;
    }

    public average(selector: IteratorFunction<T, number>): number {
        if (this.isEmpty) {
            throw new InvalidOperationException(`Operation is not allowed for empty lists.`);
        }

        return this.sum(selector) / this.length;
    }

    public concat(otherList: Iterable<T>): Queryable<T> {
        const self: this = this;

        return new QueryableImpl({
            *[Symbol.iterator](): Iterator<T> {
                for (const item of self) {
                    yield item;
                }

                for (const item of otherList) {
                    yield item;
                }
            }
        });
    }

    public contains(otherItem: T): boolean;

    public contains(otherItem: T, comparator: EqualityComparator<T>): boolean;

    public contains(otherItem: T, comparator: EqualityComparator<T> = StrictEqualityComparator.get()): boolean {
        for (const currentItem of this) {
            if (comparator.equals(currentItem, otherItem)) {
                return true;
            }
        }

        return false;
    }

    public containsAll(items: Iterable<T>): boolean;

    public containsAll(items: Iterable<T>, comparator: EqualityComparator<T>): boolean;

    public containsAll(items: Iterable<T>, comparator: EqualityComparator<T> = StrictEqualityComparator.get()): boolean {
        const _items: QueryableImpl<T> = new QueryableImpl(items);

        if (_items.isEmpty) {
            return false;
        }

        for (const item of items) {
            if (!this.contains(item, comparator)) {
                return false;
            }
        }

        return true;
    }

    public count(predicate: IteratorFunction<T, boolean>): number {
        return this.aggregate((count: number, item: T, index: number) => {
            const itemMatchesPredicate: boolean = predicate(item, index);

            if (itemMatchesPredicate) {
                return count + 1;
            }

            return count;
        }, 0);
    }

    /**
     * Returns distinct elements from a sequence by using a specified EqualityComparator to compare values.
     */
    public distinct(): Queryable<T>;

    public distinct(comparator: EqualityComparator<T>): Queryable<T>;

    public distinct(comparator: EqualityComparator<T> = StrictEqualityComparator.get()): Queryable<T> {
        const self: this = this;

        return new QueryableImpl({
            *[Symbol.iterator](): Iterator<T> {
                const uniqueItems: T[] = [];
                const uniqueItems$ = new QueryableImpl(uniqueItems);

                for (const item of self) {
                    if (!uniqueItems$.contains(item, comparator)) {
                        uniqueItems.push(item);

                        yield item;
                    }
                }
            }
        });
    }

    public equals(otherList: Iterable<T>): boolean;

    public equals(otherList: Iterable<T>, comparator: EqualityComparator<T>): boolean;

    // tslint:disable-next-line:cyclomatic-complexity
    public equals(otherList: Iterable<T>, comparator: EqualityComparator<T> = StrictEqualityComparator.get()): boolean {
        const otherItems: QueryableImpl<T> = new QueryableImpl(otherList);

        if (this.length !== otherItems.length) {
            return false;
        }

        if (this.isEmpty && otherItems.isEmpty) {
            return true;
        }

        const thisIterator: Iterator<T> = this[Symbol.iterator]();
        const otherIterator: Iterator<T> = otherList[Symbol.iterator]();

        let thisIteratorResult: IteratorResult<T> = thisIterator.next();
        let otherIteratorResult: IteratorResult<T> = otherIterator.next();

        while (thisIteratorResult.done === false && otherIteratorResult.done === false) {
            if (!comparator.equals(thisIteratorResult.value, otherIteratorResult.value)) {
                return false;
            }

            thisIteratorResult = thisIterator.next();
            otherIteratorResult = otherIterator.next();
        }

        return true;
    }

    /**
     * Produces the set difference of two sequences.
     */
    public except(otherList: Iterable<T>): Queryable<T>;

    /**
     * Produces the set difference of two sequences.
     */
    public except(otherList: Iterable<T>, comparator: EqualityComparator<T>): Queryable<T>;

    /**
     * Produces the set difference of two sequences.
     */
    public except(otherList: Iterable<T>, comparator: EqualityComparator<T> = StrictEqualityComparator.get()): Queryable<T> {
        const self: this = this;
        const other: QueryableImpl<T> = new QueryableImpl(otherList);

        return new QueryableImpl({
            *[Symbol.iterator](): Iterator<T> {
                for (const item of self) {
                    if (!other.contains(item, comparator)) {
                        yield item;
                    }
                }

                for (const item of other) {
                    if (!self.contains(item, comparator)) {
                        yield item;
                    }
                }
            }
        });
    }

    public findAll(predicate: IteratorFunction<T, boolean>): Queryable<T> {
        const self: this = this;

        return new QueryableImpl({
            *[Symbol.iterator](): Iterator<T> {
                let index: number = 0;

                for (const item of self) {
                    if (predicate(item, index)) {
                        yield item;
                    }

                    index++;
                }
            }
        });
    }

    public first(predicate: IteratorFunction<T, boolean>): T | undefined;
    public first(predicate: IteratorFunction<T, boolean>, defaultValue: T): T;
    public first(predicate: IteratorFunction<T, boolean>, defaultValue?: T): T | undefined {
        let index: number = 0;

        for (const item of this) {
            if (predicate(item, index)) {
                return item;
            }

            index++;
        }

        return defaultValue;
    }

    public firstOrDefault(defaultValue: T): T {
        if (this.isEmpty) {
            return defaultValue;
        } else {
            return this.getAt(0);
        }
    }

    public forEach(iterator: IteratorFunction<T, false | void>): void;
    public forEach(iterator: IteratorFunction<T, false | void>, startIndex: number): void;
    public forEach(iterator: IteratorFunction<T, false | void>, startIndex: number, count: number): void;
    public forEach(iterator: IteratorFunction<T, false | void>, startIndex: number = 0, count: number = this.length - startIndex): void {
        CollectionUtils.validateSliceBounds(this, startIndex, count);

        let index: number = 0;
        let itemsLeft: number = count;

        for (const item of this) {
            if (itemsLeft === 0) {
                break;
            }

            if (index >= startIndex) {
                const result: boolean | void = iterator(item, index);

                if (result === false) {
                    return;
                }
            }

            index++;
            itemsLeft--;
        }
    }

    public forEachBack(iterator: IteratorFunction<T, false | void>): void;
    public forEachBack(iterator: IteratorFunction<T, false | void>, startIndex: number): void;
    public forEachBack(iterator: IteratorFunction<T, false | void>, startIndex: number, count: number): void;
    public forEachBack(
        iterator: IteratorFunction<T, false | void>,
        startIndex: number = Math.max(this.length - 1, 0),
        count: number = this.length > 0 ? startIndex + 1 : 0
    ): void {
        CollectionUtils.validateSliceBounds(this, startIndex - count + 1, count);

        let index: number = startIndex;
        let itemsLeft: number = count;

        while (itemsLeft > 0) {
            if (iterator(this.getAt(index), index) === false) {
                break;
            }

            index--;
            itemsLeft--;
        }
    }

    public getAt(index: number): T {
        if (index < 0) {
            throw new IndexOutOfBoundsException(index, this.length);
        }

        let position: number = 0;

        for (const item of this) {
            if (index === position) {
                return item;
            }

            position++;
        }

        throw new IndexOutOfBoundsException(index, this.length);
    }

    public groupBy<TKey>(keySelector: IteratorFunction<T, TKey>): Queryable<Grouping<TKey, T>>;
    public groupBy<TKey>(keySelector: IteratorFunction<T, TKey>, keyComparator: EqualityComparator<TKey>): Queryable<Grouping<TKey, T>>;
    public groupBy<TKey>(
        keySelector: IteratorFunction<T, TKey>,
        keyComparator: EqualityComparator<TKey> = StrictEqualityComparator.get()
    ): Queryable<Grouping<TKey, T>> {
        const allKeys: Queryable<TKey> = this.map((item: T, index: number) => {
            return keySelector(item, index);
        });
        const keys: Queryable<TKey> = allKeys.distinct(keyComparator);
        const groups: Array<Grouping<TKey, T>> = [];

        for (const key of keys) {
            const items: Queryable<T> = this.findAll((item: T, index: number): boolean => {
                const otherKey: TKey = keySelector(item, index);

                return keyComparator.equals(key, otherKey);
            });
            const group: Grouping<TKey, T> = new Grouping(key, items);

            groups.push(group);
        }

        return new QueryableImpl(groups);
    }

    public intersect(otherList: Iterable<T>): Queryable<T>;
    public intersect(otherList: Iterable<T>, comparator: EqualityComparator<T>): Queryable<T>;
    public intersect(otherList: Iterable<T>, comparator: EqualityComparator<T> = StrictEqualityComparator.get()): Queryable<T> {
        const self: this = this;
        const other: QueryableImpl<T> = new QueryableImpl(otherList);

        return new QueryableImpl({
            *[Symbol.iterator](): Iterator<T> {
                for (const item of self) {
                    if (other.contains(item, comparator)) {
                        yield item;
                    }
                }
            }
        });
    }

    public *entries(): Iterable<[T, number]> {
        let index: number = 0;

        for (const item of this) {
            yield [item, index];

            index++;
        }
    }

    public join<TOuter, TKey, TResult>(
        outerList: Iterable<TOuter>,
        outerKeySelector: IteratorFunction<TOuter, TKey>,
        innerKeySelector: IteratorFunction<T, TKey>,
        resultSelector: CombineFunction<T, TOuter, TResult>
    ): Queryable<TResult>;

    public join<TOuter, TKey, TResult>(
        outerList: Iterable<TOuter>,
        outerKeySelector: IteratorFunction<TOuter, TKey>,
        innerKeySelector: IteratorFunction<T, TKey>,
        resultSelector: CombineFunction<T, TOuter, TResult>,
        keyComparator: EqualityComparator<TKey>
    ): Queryable<TResult>;

    public join<TOuter, TKey, TResult>(
        outerList: Iterable<TOuter>,
        outerKeySelector: IteratorFunction<TOuter, TKey>,
        innerKeySelector: IteratorFunction<T, TKey>,
        resultSelector: CombineFunction<T, TOuter, TResult>,
        keyComparator: EqualityComparator<TKey> = StrictEqualityComparator.get()
    ): Queryable<TResult> {
        const self = this;
        const outer: QueryableImpl<TOuter> = new QueryableImpl(outerList);

        return new QueryableImpl({
            *[Symbol.iterator](): Iterator<TResult> {
                for (const [innerItem, innerIndex] of self.entries()) {
                    const innerKey: TKey = innerKeySelector(innerItem, innerIndex);

                    for (const [outerItem, outerIndex] of outer.entries()) {
                        const outerKey: TKey = outerKeySelector(outerItem, outerIndex);

                        if (keyComparator.equals(innerKey, outerKey)) {
                            yield resultSelector(innerItem, outerItem);
                        }
                    }
                }
            }
        });
    }

    public last(predicate: IteratorFunction<T, boolean>): T | undefined;

    public last(predicate: IteratorFunction<T, boolean>, defaultValue: T): T;

    public last(predicate: IteratorFunction<T, boolean>, defaultValue?: T): T | undefined {
        let lastItem: T | undefined = defaultValue;
        let index: number = 0;

        for (const item of this) {
            if (predicate(item, index)) {
                lastItem = item;
            }

            index++;
        }

        return lastItem;
    }

    public lastOrDefault(defaultValue: T): T {
        if (this.isEmpty) {
            return defaultValue;
        } else {
            return this.getAt(this.length - 1);
        }
    }

    public map<TResult>(selector: IteratorFunction<T, TResult>): Queryable<TResult> {
        const self: this = this;

        return new QueryableImpl({
            *[Symbol.iterator](): Iterator<TResult> {
                let index: number = 0;

                for (const item of self) {
                    yield selector(item, index);

                    index++;
                }
            }
        });
    }

    public max(selector: IteratorFunction<T, number>): number {
        if (this.isEmpty) {
            throw new InvalidOperationException('Unable to perform operation on empty list.');
        }

        return this.aggregate((maxValue: number, actualItem: T, index: number): number => {
            const itemValue: number = selector(actualItem, index);

            if (index === 0) {
                return itemValue;
            }

            return Math.max(maxValue, itemValue);
        }, 0);
    }

    public min(selector: IteratorFunction<T, number>): number {
        if (this.isEmpty) {
            throw new InvalidOperationException('Unable to perform operation on empty list.');
        }

        return this.aggregate((minValue: number, actualItem: T, index: number): number => {
            const itemValue: number = selector(actualItem, index);

            if (index === 0) {
                return itemValue;
            }

            return Math.min(minValue, itemValue);
        }, 0);
    }

    public orderBy<TKey>(keySelector: SelectorFunction<T, TKey>, comparator: Comparator<TKey>): Queryable<T>;
    public orderBy<TKey>(keySelector: SelectorFunction<T, TKey>, comparator: Comparator<TKey>, sortOrder: SortOrder): Queryable<T>;
    public orderBy<TKey>(
        keySelector: SelectorFunction<T, TKey>,
        comparator: Comparator<TKey>,
        sortOrder: SortOrder = SortOrder.ASCENDING
    ): Queryable<T> {
        return new QueryableImpl(this.toArray().sort((x: T, y: T): number => {
            const xKey: TKey = keySelector(x);
            const yKey: TKey = keySelector(y);

            return comparator.compare(xKey, yKey) * sortOrder;
        }));
    }

    public random(): T {
        if (this.isEmpty) {
            throw new NoSuchItemException('Random item not found.');
        }

        const index: number = new RandomInt(0, this.length).value;

        return this.getAt(index);
    }

    public reverse(): Queryable<T> {
        return new QueryableImpl(this.toArray().reverse());
    }

    public selectMany<TInnerItem, TResult>(
        collectionSelector: IteratorFunction<T, Iterable<TInnerItem>>,
        resultSelector: CombineFunction<T, TInnerItem, TResult>
    ): Queryable<TResult> {
        const self: this = this;

        return new QueryableImpl({
            *[Symbol.iterator](): Iterator<TResult> {
                const collections: Queryable<Iterable<TInnerItem>> = self.map<Iterable<TInnerItem>>((
                    actualItem: T,
                    actualItemIndex: number
                ): Iterable<TInnerItem> => {
                    return collectionSelector(actualItem, actualItemIndex);
                });

                let index: number = 0;

                // TODO: use two iterators
                for (const collection of collections) {
                    const actualItem: T = self.getAt(index);

                    for (const innerItem of collection) {
                        yield resultSelector(actualItem, innerItem);
                    }

                    index += 1;
                }
            }
        });
    }

    public skip(offset: number): Queryable<T> {
        const self: this = this;

        if (offset < 0) {
            throw new IndexOutOfBoundsException('Offset cannot be negative.');
        }

        return new QueryableImpl({
            *[Symbol.iterator](): Iterator<T> {
                let index: number = 0;

                for (const item of self) {
                    if (index >= offset) {
                        yield item;
                    }

                    index++;
                }
            }
        });
    }

    public skipWhile(condition: IteratorFunction<T, boolean>): Queryable<T> {
        const self: this = this;

        return new QueryableImpl({
            *[Symbol.iterator](): Iterator<T> {
                let skip: boolean = true;

                for (const [item, index] of self.entries()) {
                    if (skip) {
                        skip = condition(item, index);
                    }

                    if (!skip) {
                        yield item;
                    }
                }
            }
        });
    }

    public slice(offset: number): Queryable<T>;
    public slice(offset: number, length: number): Queryable<T>;
    public slice(offset: number, length: number = this.length - offset): Queryable<T> {
        CollectionUtils.validateSliceBounds(this, offset, length);

        const self: this = this;
        const maxIndex: number = offset + length;

        return new QueryableImpl({
            *[Symbol.iterator](): Iterator<T> {
                for (const [item, index] of self.entries()) {
                    if (index >= maxIndex) {
                        break;
                    }

                    if (index >= offset) {
                        yield item;
                    }
                }
            }
        });
    }

    public sum(selector: IteratorFunction<T, number>): number {
        if (this.isEmpty) {
            throw new InvalidOperationException(`Operation is not allowed for empty lists.`);
        }

        return this.aggregate((total: number, actualItem: T, index: number): number => {
            const selectedValue: number = selector(actualItem, index);

            return total + selectedValue;
        }, 0);
    }

    public take(length: number): Queryable<T> {
        if (length < 0) {
            throw new InvalidArgumentException('Slice length cannot be negative.');
        }

        const self: this = this;

        return new QueryableImpl({
            *[Symbol.iterator](): Iterator<T> {
                for (const [item, index] of self.entries()) {
                    if (index >= length) {
                        break;
                    }

                    yield item;
                }
            }
        });
    }

    public takeWhile(condition: IteratorFunction<T, boolean>): Queryable<T> {
        const self: this = this;

        return new QueryableImpl({
            *[Symbol.iterator](): Iterator<T> {
                for (const [item, index] of self.entries()) {
                    if (!condition(item, index)) {
                        break;
                    }

                    yield item;
                }
            }
        });
    }

    public toArray(): T[] {
        return [...this];
    }

    public toJSON(): T[] {
        return this.toArray();
    }

    public union(otherList: Iterable<T>): Queryable<T>;
    public union(otherList: Iterable<T>, comparator: EqualityComparator<T>): Queryable<T>;
    public union(otherList: Iterable<T>, comparator: EqualityComparator<T> = StrictEqualityComparator.get()): Queryable<T> {
        const self = this;

        return new QueryableImpl({
            *[Symbol.iterator](): Iterator<T> {
                const union: T[] = self.toArray();
                const union$: QueryableImpl<T> = new QueryableImpl(union);

                for (const item of self) {
                    yield item;
                }

                for (const item of otherList) {
                    if (!union$.contains(item, comparator)) {
                        union.push(item);
                        yield item;
                    }
                }
            }
        });
    }

    public zip<TOther, TResult>(
        otherItems: Iterable<TOther>,
        resultSelector: CombineFunction<T, TOther, TResult>
    ): Queryable<TResult> {
        const self: this = this;

        return new QueryableImpl({
            *[Symbol.iterator](): Iterator<TResult> {
                const otherItems$ = new QueryableImpl(otherItems);
                const minLength: number = Math.min(self.length, otherItems$.length);

                for (const [otherItem, index] of otherItems$.entries()) {
                    if (index >= minLength) {
                        break;
                    }

                    const ownItem: T = self.getAt(index);
                    const result: TResult = resultSelector(ownItem, otherItem);

                    yield result;
                }
            }
        });
    }
}
