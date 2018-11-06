import {LinkedMap} from '../collections/map/mutable/LinkedMap';
import {Value} from './Value';
import {Observer} from './Observer';
import {Subscription} from './Subscription';
import {Disposable} from '../base/Disposable';
import {EqualityComparator} from '../comparison/equality/EqualityComparator';

/**
 * @author Alex Chugaev
 * @since 0.0.1
 */
export class ObservableValue<T> implements Value<T>, Disposable {
    private readonly _comparator: EqualityComparator<T> | undefined;
    private readonly _observers: LinkedMap<Observer<T>, Subscription<T>> = new LinkedMap();
    private _value: T;

    public constructor(initialValue: T, equalityComparator?: EqualityComparator<T>) {
        this._value = initialValue;
        this._comparator = equalityComparator;
    }

    public dispose(): void {
        for (const {key: observer, value: subscription} of this._observers) {
            observer.onCompleted();
            subscription.dispose();
        }
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
        const existingSubscription: Subscription<T> | undefined = this._observers.get(observer);

        if (existingSubscription != null) {
            return existingSubscription;
        }

        const newSubscription: Subscription<T> = new Subscription(this._observers, observer);

        this._observers.put(observer, newSubscription);

        observer.onNext(this._value);

        return newSubscription;
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
