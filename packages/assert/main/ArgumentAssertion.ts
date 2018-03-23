import {ArgumentNullException} from '@monument/core/main/exceptions/ArgumentNullException';
import {Type} from '@monument/core/main/Type';
import {ArgumentTypeException} from '@monument/core/main/exceptions/ArgumentTypeException';
import {ArgumentRangeException} from '@monument/core/main/exceptions/ArgumentRangeException';
import {ArgumentIndexOutOfBoundsException} from '@monument/core/main/exceptions/ArgumentIndexOutOfBoundsException';
import {InvalidArgumentException} from '@monument/core/main/exceptions/InvalidArgumentException';


export class ArgumentAssertion {
    private _argumentName: string;
    private _argumentValue: any;


    public constructor(argumentName: string, argumentValue: any) {
        if (argumentName.length === 0) {
            throw new InvalidArgumentException('argumentName', 'Cannot be empty.');
        }

        this._argumentName = argumentName;
        this._argumentValue = argumentValue;
    }


    public notNull(): this {
        if (this._argumentValue == null) {
            throw new ArgumentNullException(this._argumentName);
        }

        return this;
    }


    public notEmptyString(): this {
        if (this._argumentValue.length === 0) {
            throw new InvalidArgumentException(this._argumentName, `Value can not be empty string.`);
        }

        return this;
    }


    public type(argumentClass: Type<any>): this {
        if (!(this._argumentValue instanceof argumentClass)) {
            throw new ArgumentTypeException(this._argumentName, argumentClass);
        }

        return this;
    }


    public bounds(min: number, max: number): this {
        if (this._argumentValue < min || this._argumentValue > max) {
            throw new ArgumentRangeException(this._argumentName, this._argumentValue, min, max);
        }

        return this;
    }


    public indexBounds(min: number, max: number): this {
        if (this._argumentValue < min || this._argumentValue >= max) {
            throw new ArgumentIndexOutOfBoundsException(
                this._argumentName,
                this._argumentValue,
                min,
                max
            );
        }

        return this;
    }


    public isLength(): this {
        if (!isFinite(this._argumentValue) || isNaN(this._argumentValue) || this._argumentValue < 0) {
            throw new ArgumentRangeException(this._argumentName, this._argumentValue, 0, Infinity);
        }

        return this;
    }


    public isIndexOf(sequence: ArrayLike<any>): this {
        if (this._argumentValue < 0 || this._argumentValue >= sequence.length) {
            throw new ArgumentIndexOutOfBoundsException(
                this._argumentName,
                this._argumentValue,
                0,
                sequence.length
            );
        }

        return this;
    }


    public isIndex(): this {
        if (this._argumentValue < 0) {
            throw new ArgumentIndexOutOfBoundsException(
                this._argumentName,
                this._argumentValue,
                0,
                Infinity
            );
        }

        return this;
    }
}
