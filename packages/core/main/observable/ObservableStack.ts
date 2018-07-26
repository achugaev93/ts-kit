import {Enumerable} from '../collection/readonly/Enumerable';
import {IteratorFunction} from '../collection/IteratorFunction';
import {ListStack} from '../collection/mutable/ListStack';
import {CollectionChangedEventArgs} from './CollectionChangedEventArgs';
import {NotifyCollectionChanged} from './NotifyCollectionChanged';
import {Cloneable} from '../Cloneable';
import {ConfigurableEvent} from '../events/ConfigurableEvent';
import {Disposable} from '../Disposable';
import {Event} from '../events/Event';
import {EqualityComparator} from '../EqualityComparator';


export class ObservableStack<T> extends ListStack<T> implements Cloneable<ObservableStack<T>>, Disposable, NotifyCollectionChanged<T> {
    private readonly _collectionChanged: ConfigurableEvent<this, CollectionChangedEventArgs> = new ConfigurableEvent();

    public get collectionChanged(): Event<this, CollectionChangedEventArgs> {
        return this._collectionChanged;
    }


    public clone(): ObservableStack<T> {
        return new ObservableStack(this);
    }


    public add(item: T): boolean {
        if (super.add(item)) {
            this.onCollectionChanged();

            return true;
        }

        return false;
    }


    public addAll(items: Enumerable<T>): boolean {
        if (super.addAll(items)) {
            this.onCollectionChanged();

            return true;
        }

        return false;
    }


    public remove(item: T): boolean {
        if (super.remove(item)) {
            this.onCollectionChanged();

            return true;
        }

        return false;
    }


    public removeAll(items: Enumerable<T>): boolean {
        if (super.removeAll(items)) {
            this.onCollectionChanged();

            return true;
        }

        return false;
    }


    public removeBy(predicate: IteratorFunction<T, boolean>): boolean {
        if (super.removeBy(predicate)) {
            this.onCollectionChanged();

            return true;
        }

        return false;
    }


    public retainAll(
        otherItems: Enumerable<T>,
        comparator?: EqualityComparator<T>
    ): boolean {
        if (super.retainAll(otherItems, comparator)) {
            this.onCollectionChanged();

            return true;
        }

        return false;
    }


    public clear(): boolean {
        if (super.clear()) {
            this.onCollectionChanged();

            return true;
        }

        return false;
    }


    public pop(): T {
        const poppedItem: T = super.pop();

        this.onCollectionChanged();

        return poppedItem;
    }


    public dispose(): void {
        this._collectionChanged.dispose();
    }


    protected onCollectionChanged() {
        this._collectionChanged.trigger(this, new CollectionChangedEventArgs());
    }
}
