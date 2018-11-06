import {Cloneable} from '../../../base/Cloneable';
import {Sequence} from '../../base/Sequence';
import {Queryable} from '../../base/Queryable';
import {CollectionUtils} from '../../base/CollectionUtils';
import {IteratorFunction} from '../../base/IteratorFunction';
import {EqualityComparator} from '../../../comparison/equality/EqualityComparator';
import {StrictEqualityComparator} from '../../../comparison/equality/StrictEqualityComparator';
import {AbstractList} from './AbstractList';
import {LinkedListNode} from './LinkedListNode';

type LinkedListIteratorFunction<TItem, TResult> = (node: LinkedListNode<TItem>, index: number) => TResult;


/**
 * @author Alex Chugaev
 * @since 0.0.1
 */
export class LinkedList<T> extends AbstractList<T> implements Cloneable<LinkedList<T>> {
    private _length: number = 0;
    private _firstNode: LinkedListNode<T> | undefined;
    private _lastNode: LinkedListNode<T> | undefined;

    public get length(): number {
        return this._length;
    }

    public constructor(items?: Sequence<T>) {
        super();

        if (items != null) {
            this.addAll(items);
        }
    }

    public* [Symbol.iterator](): Iterator<T> {
        let node: LinkedListNode<T> | undefined = this._firstNode;

        while (node != null) {
            yield node.nodeValue;

            node = node.nextNode;
        }
    }

    public clone(): LinkedList<T> {
        return new LinkedList(this);
    }

    public remove(item: T): boolean;

    public remove(item: T, comparator: EqualityComparator<T>): boolean;

    public remove(item: T, comparator: EqualityComparator<T> = StrictEqualityComparator.get()): boolean {
        const oldLength: number = this.length;

        this.beginTransaction();

        let result: [number, LinkedListNode<T>] | undefined = this.findNode(item, comparator);
        let itemsRemoved: number = 0;

        while (result != null) {
            const [index, node] = result;
            this.removeNode(node);
            this.onRemove(index + itemsRemoved, node.nodeValue);

            result = this.findNode(item, comparator);
            itemsRemoved++;
        }

        this.endTransaction();

        return oldLength !== this.length;
    }

    public removeBy(predicate: IteratorFunction<T, boolean>): boolean {
        const oldLength: number = this.length;

        this.beginTransaction();

        let currentNode: LinkedListNode<T> | undefined = this._firstNode;
        let index: number = 0;

        while (currentNode) {
            const nextNode: LinkedListNode<T> | undefined = currentNode.nextNode;
            const remove: boolean = predicate(currentNode.nodeValue, index);

            if (remove) {
                this.removeNode(currentNode);
                this.onRemove(index, currentNode.nodeValue);
            }

            index++;

            currentNode = nextNode;
        }

        this.endTransaction();

        return this.length !== oldLength;
    }

    public reverse(): Queryable<T> {
        const result: LinkedList<T> = new LinkedList();

        let node = this._lastNode;

        while (node != null) {
            result.add(node.nodeValue);

            node = node.previousNode;
        }

        return result;
    }

    protected create<I>(items?: Sequence<I>): LinkedList<I> {
        return new LinkedList(items);
    }

    protected doAdd(item: T): void {
        const newNode: LinkedListNode<T> = new LinkedListNode(item);

        newNode.link(this._lastNode, undefined);

        this._lastNode = newNode;

        if (this._firstNode == null) {
            this._firstNode = newNode;
        }

        this._length++;
    }

    protected doAddAll(items: Sequence<T>): void {
        for (const item of items) {
            this.doAdd(item);
        }
    }

    protected doClear(): void {
        delete this._firstNode;
        delete this._lastNode;

        this._length = 0;
    }

    protected doForEach(iterator: IteratorFunction<T, boolean | void>, startIndex: number, count: number): void {
        let itemsLeft: number = count;

        for (
            let index = startIndex, node = this.getNodeAt(startIndex);
            itemsLeft > 0 && node != null;
            itemsLeft--, index++, node = node.nextNode
        ) {
            const stop: boolean = iterator(node.nodeValue, index) === false;

            if (stop) {
                break;
            }
        }
    }

    protected doGetAt(index: number): T {
        const node: LinkedListNode<T> = this.getNodeAt(index) as LinkedListNode<T>;

        return node.nodeValue;
    }

    protected doInsert(index: number, item: T): void {
        const newNode: LinkedListNode<T> = new LinkedListNode(item);
        const previousNode: LinkedListNode<T> | undefined = this.getNodeAt(index - 1);
        const nextNode: LinkedListNode<T> | undefined = this.getNodeAt(index);

        newNode.link(previousNode, nextNode);

        if (previousNode == null) {
            this._firstNode = newNode;
        }

        if (nextNode == null) {
            this._lastNode = newNode;
        }

        this._length++;
    }

    protected doInsertAll(index: number, items: Sequence<T>): void {
        let offset: number = index;

        for (const item of items) {
            this.doInsert(offset, item);

            offset++;
        }
    }

    protected doRemoveAt(index: number): T {
        const node: LinkedListNode<T> = this.getNodeAt(index) as LinkedListNode<T>;

        this.removeNode(node);

        return node.nodeValue;
    }

    protected doSetAt(index: number, newValue: T): T {
        CollectionUtils.validateIndexBounds(this, index);

        const node: LinkedListNode<T> = this.getNodeAt(index) as LinkedListNode<T>;
        const oldValue: T = node.nodeValue;

        node.nodeValue = newValue;

        return oldValue;
    }

    private findNode(value: T, comparator: EqualityComparator<T>): [number, LinkedListNode<T>] | undefined {
        let node: LinkedListNode<T> | undefined = this._firstNode;
        let index: number = 0;

        while (node) {
            if (comparator.equals(node.nodeValue, value)) {
                return [index, node];
            }

            node = node.nextNode;
            index++;
        }

        return undefined;
    }

    private forEachNode(iterator: LinkedListIteratorFunction<T, boolean | void>): void {
        let node: LinkedListNode<T> | undefined = this._firstNode;
        let index: number = 0;

        while (node) {
            const nextNode: LinkedListNode<T> | undefined = node.nextNode;
            const returnValue: boolean | void = iterator(node, index);

            if (returnValue === false) {
                break;
            }

            index++;
            node = nextNode;
        }
    }

    private forEachNodeReversed(iterator: LinkedListIteratorFunction<T, boolean | void>): void {
        let node: LinkedListNode<T> | undefined = this._lastNode;
        let index: number = this.lastIndex;

        while (node != null) {
            const nextNode = node.previousNode;
            const returnValue: boolean | void = iterator(node, index);

            if (returnValue === false) {
                break;
            }

            index--;
            node = nextNode;
        }
    }

    private getNodeAt(searchIndex: number): LinkedListNode<T> | undefined {
        if (!this.isCorrectIndex(searchIndex)) {
            return;
        }

        // Optimization for first and last nodes.

        if (searchIndex === 0) {
            return this._firstNode;
        }

        if (searchIndex === this.lastIndex) {
            return this._lastNode;
        }

        let foundNode: LinkedListNode<T> | undefined;
        const midIndex: number = Math.ceil(this.length / 2);

        // Optimize iteration by starting from start or end.

        if (searchIndex < midIndex) {
            this.forEachNode((node: LinkedListNode<T>, nodeIndex: number): boolean | void => {
                if (searchIndex === nodeIndex) {
                    foundNode = node;

                    return false;
                }
            });
        } else {
            this.forEachNodeReversed((node: LinkedListNode<T>, nodeIndex: number): boolean | void => {
                if (searchIndex === nodeIndex) {
                    foundNode = node;

                    return false;
                }
            });
        }

        return foundNode;
    }

    private isCorrectIndex(index: number): boolean {
        return index >= 0 && index < this.length;
    }

    private removeNode(node: LinkedListNode<T>): void {
        if (this._firstNode === node) {
            this._firstNode = node.nextNode;
        }

        if (this._lastNode === node) {
            this._lastNode = node.previousNode;
        }

        node.unlink();

        this._length--;
    }
}
