import {ListMap} from '../collection/mutable/ListMap';
import {Value} from './Value';
import {Observer} from './Observer';
import {ObserverSubscription} from './ObserverSubscription';
import {Disposable} from '../Disposable';
import {EqualityComparator} from '../utils/comparison/EqualityComparator';


export class ObservableValue<T> implements Value<T>, Disposable {
    private readonly _comparator: EqualityComparator<T> | undefined;
    private readonly _observers: ListMap<Observer<T>, ObserverSubscription<T>> = new ListMap();
    private _value: T;


    public constructor(initialValue: T, equalityComparator?: EqualityComparator<T>) {
        this._value = initialValue;
        this._comparator = equalityComparator;
    }

    public get(): T {
        return this._value;
    }

    public set(value: T): void {
        if (!this.isEqualValue(value)) {
            this._value = value;

            this.onChange(value);
        }
    }

    public subscribe(observer: Observer<T>): Disposable {
        const existingSubscription: ObserverSubscription<T> | undefined = this._observers.get(observer);

        if (existingSubscription != null) {
            return existingSubscription;
        }

        const newSubscription: ObserverSubscription<T> = new ObserverSubscription(this._observers, observer);

        this._observers.put(observer, newSubscription);

        observer.onNext(this._value);

        return newSubscription;
    }


    public dispose(): void {
        for (const {key: observer, value: subscription} of this._observers) {
            observer.onCompleted();
            subscription.dispose();
        }
    }


    protected isEqualValue(candidate: T): boolean {
        return this._comparator != null ? this._comparator.equals(this._value, candidate) : this._value === candidate;
    }


    protected onChange(value: T): void {
        for (const {key: observer} of this._observers) {
            observer.onNext(value);
        }
    }
}
