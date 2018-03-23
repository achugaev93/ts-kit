import {EqualityComparator} from '@monument/core/main/EqualityComparator';
import {StrictEqualityComparator} from '@monument/core/main/StrictEqualityComparator';
import {Stack} from '@monument/collections-core/main/Stack';
import {IteratorFunction} from '@monument/collections-core/main/IteratorFunction';
import {EmptyStackException} from '@monument/collections-core/main/EmptyStackException';
import {LinkedList} from './LinkedList';
import {AbstractCollection} from './AbstractCollection';


export class ListStack<T> extends AbstractCollection<T> implements Stack<T> {
    private _items: LinkedList<T>;


    // Countable interface implementation


    public get length(): number {
        return this._items.length;
    }


    public constructor(items?: Iterable<T>) {
        super();

        this._items = new LinkedList();

        if (items != null) {
            this.addAll(items);
        }
    }


    // Cloneable interface implementation


    public clone(): ListStack<T> {
        return new ListStack(this);
    }


    // Enumerable interface implementation


    public getIterator(): Iterator<T> {
        return this._items.getIterator();
    }


    public forEach(iterator: IteratorFunction<T, boolean | void>, startIndex?: number, count?: number): void {
        this._items.forEach(iterator, startIndex, count);
    }


    public forEachReversed(iterator: IteratorFunction<T, boolean | void>, startIndex?: number, count?: number): void {
        this._items.forEachReversed(iterator, startIndex, count);
    }


    // Collection interface implementation


    public add(item: T): boolean {
        return this._items.add(item);
    }


    public remove(item: T, comparator: EqualityComparator<T> = StrictEqualityComparator.instance): boolean {
        return this._items.remove(item, comparator);
    }


    public removeAll(items: Iterable<T>, comparator: EqualityComparator<T> = StrictEqualityComparator.instance): boolean {
        return this._items.removeAll(items, comparator);
    }


    public removeBy(predicate: IteratorFunction<T, boolean>): boolean {
        return this._items.removeBy(predicate);
    }


    public clear(): boolean {
        return this._items.clear();
    }


    // Stack interface implementation


    public push(item: T): boolean {
        return this._items.add(item);
    }


    public peek(): T {
        if (this.isEmpty) {
            throw new EmptyStackException();
        }

        return this._items.getAt(this.length - 1);
    }


    public pop(): T {
        if (this.isEmpty) {
            throw new EmptyStackException();
        }

        return this._items.removeAt(this.length - 1);
    }
}
