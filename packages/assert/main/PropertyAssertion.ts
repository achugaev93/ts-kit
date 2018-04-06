import {PropertyNullException} from '@monument/core/main/exceptions/PropertyNullException';
import {Type} from '@monument/core/main/Type';
import {PropertyTypeException} from '@monument/core/main/exceptions/PropertyTypeException';
import {RangeException} from '@monument/core/main/RangeException';
import {IndexOutOfBoundsException} from '@monument/core/main/exceptions/IndexOutOfBoundsException';
import {Countable} from '../../collections/main/Countable';


export class PropertyAssertion {
    private _propertyName: string;
    private _propertyValue: any;


    public constructor(propertyName: string, propertyValue: any) {
        this._propertyName = propertyName;
        this._propertyValue = propertyValue;
    }


    public notNull(): this {
        if (this._propertyValue == null) {
            throw new PropertyNullException(this._propertyName);
        }

        return this;
    }


    public type(type: Type<any>): this {
        if (!(this._propertyValue instanceof type)) {
            throw new PropertyTypeException(this._propertyName, type);
        }

        return this;
    }


    public bounds(min: number, max: number): this {
        if (this._propertyValue < min || this._propertyValue > max) {
            throw new RangeException(
                `Invalid property ${this._propertyName}: ` +
                `Value (${this._propertyValue}) is out of bounds: min=${min}, max=${max}.`
            );
        }

        return this;
    }


    public indexBounds(min: number, max: number): this {
        if (this._propertyValue < min || this._propertyValue >= max) {
            throw new IndexOutOfBoundsException(
                `Invalid property ${this._propertyName}: ` +
                `Value (${this._propertyValue}) is out of bounds: min=${min}, max=${max}.`
            );
        }

        return this;
    }


    public isLength(): this {
        if (!isFinite(this._propertyValue) || isNaN(this._propertyValue) || this._propertyValue < 0) {
            throw new RangeException(
                `Invalid property ${this._propertyName}: ` +
                `Value (${this._propertyValue}) is not a valid length.`
            );
        }

        return this;
    }


    public isIndexOf(sequence: Countable): this {
        if (this._propertyValue < 0 || this._propertyValue >= sequence.length) {
            throw new IndexOutOfBoundsException(
                `Invalid property '${this._propertyName}': ` +
                `Index (${this._propertyValue}) is out of bounds [0, ${sequence.length}).`
            );
        }

        return this;
    }


    public isIndex(): this {
        if (this._propertyValue < 0) {
            throw new IndexOutOfBoundsException(
                `Invalid property '${this._propertyName}': ` +
                `Index (${this._propertyValue}) is out of bounds [0, +Infinity).`
            );
        }

        return this;
    }
}
