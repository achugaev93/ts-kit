import {EventFactory} from '../../Events/EventFactory';
import {Event} from '../../Events/Event';
import {CollectionChangedEventArgs} from './CollectionChangedEventArgs';
import {IDisposable} from '../../Core/Abstraction/IDisposable';
import {EventHandler} from '../../Events/EventHandler';
import {IEnumerable} from '../Abstraction/IEnumerable';
import {IteratorFunction} from '../IteratorFunction';
import {IEqualityComparator} from '../../Core/Abstraction/IEqualityComparator';
import {EqualityComparator} from '../../Core/EqualityComparator';
import {INotifyCollectionChanged} from './INotifyCollectionChanged';
import {Stack} from '../Stack';


export class ObservableStack<T> extends Stack<T> implements IDisposable, INotifyCollectionChanged<T, ObservableStack<T>> {
    private readonly _eventFactory: EventFactory<this> = new EventFactory(this);

    private readonly _collectionChanged: Event<this, CollectionChangedEventArgs> = this._eventFactory.create();


    public readonly collectionChanged: EventHandler<this, CollectionChangedEventArgs> = this._collectionChanged;


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


    public addAll(items: IEnumerable<T>): boolean {
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


    public removeAll(items: IEnumerable<T>): boolean {
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
        otherItems: IEnumerable<T>,
        comparator: IEqualityComparator<T> = EqualityComparator.instance
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
        this._eventFactory.dispose();
    }


    protected onCollectionChanged() {
        this._collectionChanged.dispatch(new CollectionChangedEventArgs());
    }
}
