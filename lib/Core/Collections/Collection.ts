import {ICloneable, IJSONSerializable} from '../types';
import {ICollection} from './ICollection';
import Enumerable from './Enumerable';
import EqualityComparator from './EqualityComparator';
import {IEqualityComparator} from './IEqualityComparator';


export default class Collection<T>
    extends Enumerable<T>
    implements ICollection<T>, ICloneable<ICollection<T>>, IJSONSerializable<T[]> {
    
    
    protected _isReadOnly: boolean = false;
    
    
    public get isReadOnly(): boolean {
        return this._isReadOnly;
    }


    public clone(): Collection<T> {
        return new Collection(this);
    }


    public add(item: T): void {
        this.throwIfReadOnly();
        
        Array.prototype.push.call(this, item);
    }


    public remove(item: T): boolean {
        let index: number;
        
        this.throwIfReadOnly();
    
        index = Array.prototype.indexOf.call(this, item);
    
        if (index >= 0) {
            Array.prototype.splice.call(this, index, 1);
            
            return true;
        }
    
        return false;
    }


    public clear(): void {
        this.throwIfReadOnly();
        
        this.length = 0;
    }


    public contains(otherItem: T, comparator: IEqualityComparator<T> = EqualityComparator.instance): boolean {
        for (let currentItem of this) {
            if (comparator.equals(currentItem, otherItem)) {
                return true;
            }
        }
    
        return false;
    }


    public toJSON(): T[] {
        return this.toArray();
    }
    
    
    protected throwIfReadOnly(): void {
        if (this.isReadOnly) {
            throw new Error(`Write operation is not allowed on read-only collection.`);
        }
    }
}
