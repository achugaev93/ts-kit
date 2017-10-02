import {Collection} from './Collection';
import {EqualityComparator} from '../Core/EqualityComparator';
import {ISet} from './Abstraction/ISet';
import {IEnumerable} from './Abstraction/IEnumerable';
import {IEqualityComparator} from '../Core/Abstraction/IEqualityComparator';


export class Set<T> extends Collection<T> implements ISet<T> {
    private readonly _comparator: IEqualityComparator<T>;


    public get comparator(): IEqualityComparator<T> {
        return this._comparator;
    }


    public constructor(
        items: IEnumerable<T> = [],
        comparator: IEqualityComparator<T> = EqualityComparator.instance
    ) {
        super();

        this._comparator = comparator;

        this.addAll(items);
    }


    public clone(): Set<T> {
        return new Set(this, this.comparator);
    }


    public add(item: T): boolean {
        if (this.contains(item)) {
            return false;
        }

        super.add(item);

        return true;
    }


    public remove(otherItem: T): boolean {
        for (let currentItem of this) {
            if (this.comparator.equals(currentItem, otherItem)) {
                return super.remove(currentItem);
            }
        }

        return false;
    }


    public removeAll(items: IEnumerable<T>): boolean {
        return super.removeAll(items, this.comparator);
    }


    public retainAll(items: IEnumerable<T>): boolean {
        return super.retainAll(items, this.comparator);
    }


    public intersectWith(other: IEnumerable<T>): boolean {
        let hasChanged: boolean = false;

        for (let currentItem of this) {
            let itemPresentInBothSets: boolean = false;

            for (let otherItem of other) {
                if (this.comparator.equals(currentItem, otherItem)) {
                    itemPresentInBothSets = true;

                    break;
                }
            }

            if (!itemPresentInBothSets) {
                if (this.remove(currentItem)) {
                    hasChanged = true;
                }
            }
        }

        return hasChanged;
    }


    public symmetricExceptWith(other: IEnumerable<T>): boolean {
        let hasChanged: boolean = false;

        for (let otherItem of other) {
            if (this.remove(otherItem)) {
                hasChanged = true;
            }
        }

        for (let currentItem of this) {
            for (let otherItem of other) {
                if (this.comparator.equals(currentItem, otherItem)) {
                    if (this.remove(currentItem)) {
                        hasChanged = true;
                    }
                }
            }
        }

        return hasChanged;
    }


    public contains(item: T): boolean {
        return super.contains(item, this.comparator);
    }


    public isSubsetOf(other: IEnumerable<T>): boolean {
        let isValidSubset: boolean = true;

        for (let currentItem of this) {
            let isCurrentItemInOtherSet: boolean = false;

            for (let otherItem of other) {
                if (this.comparator.equals(currentItem, otherItem)) {
                    isCurrentItemInOtherSet = true;

                    break;
                }
            }

            if (!isCurrentItemInOtherSet) {
                isValidSubset = false;

                break;
            }
        }

        return isValidSubset;
    }


    public isSupersetOf(other: IEnumerable<T>): boolean {
        let isValidSuperset: boolean = true;

        for (let otherItem of other) {
            let isOtherItemInCurrentSet: boolean = false;

            for (let currentItem of this) {
                if (this.comparator.equals(currentItem, otherItem)) {
                    isOtherItemInCurrentSet = true;

                    break;
                }
            }

            if (!isOtherItemInCurrentSet) {
                isValidSuperset = false;

                break;
            }
        }

        return isValidSuperset;
    }


    public isProperSubsetOf(other: IEnumerable<T>): boolean {
        if (this.length >= other.length) {
            return false;
        }

        return this.isSubsetOf(other);
    }


    public isProperSupersetOf(other: IEnumerable<T>): boolean {
        if (this.length <= other.length) {
            return false;
        }

        return this.isSupersetOf(other);
    }


    public overlaps(other: IEnumerable<T>): boolean {
        for (let currentItem of this) {
            for (let otherItem of other) {
                if (this.comparator.equals(currentItem, otherItem)) {
                    return true;
                }
            }
        }

        return false;
    }


    public setEquals(other: IEnumerable<T>): boolean {
        if (this.length !== other.length) {
            return false;
        }

        for (let otherItem of other) {
            if (!this.contains(otherItem)) {
                return false;
            }
        }

        for (let currentItem of this) {
            let currentItemInOtherCollection: boolean = false;

            for (let otherItem of other) {
                if (this.comparator.equals(currentItem, otherItem)) {
                    currentItemInOtherCollection = true;

                    break;
                }
            }

            if (!currentItemInOtherCollection) {
                return false;
            }
        }

        return true;
    }
}
