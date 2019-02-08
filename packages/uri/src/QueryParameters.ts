import { BooleanParser, FloatParser, IntParser, LinkedMultiValueMap, PreserveCaseEqualityComparator, ToString } from '@monument/core';
import { ReadOnlyQueryParameters } from './ReadOnlyQueryParameters';
import { QueryParameterValueEqualityComparator } from './QueryParameterValueEqualityComparator';
import { UriConstants } from './UriConstants';
import { UriEncoder } from './UriEncoder';

/**
 * @since 0.0.1
 * @author Alex Chugaev
 * @final
 * @readonly
 */
export class QueryParameters extends LinkedMultiValueMap<string, ToString> implements ReadOnlyQueryParameters {
    private readonly _encoder: UriEncoder = new UriEncoder();

    public constructor();
    public constructor(source: string);
    public constructor(source?: string) {
        super(PreserveCaseEqualityComparator.get(), QueryParameterValueEqualityComparator.get());

        if (source != null) {
            const pairs: string[] = source.split(UriConstants.PARAMETERS_DELIMITER);

            for (const pair of pairs) {
                const parts: string[] = pair.split(UriConstants.KEY_VALUE_DELIMITER);

                if (parts.length === UriConstants.KEY_VALUE_PAIR_LENGTH) {
                    const name: string = this._encoder.decodeComponent(parts[UriConstants.KEY_COMPONENT_INDEX]);
                    const value: string = this._encoder.decodeComponent(parts[UriConstants.VALUE_COMPONENT_INDEX]);

                    this.put(name, value);
                }
            }
        }
    }

    public getBoolean(key: string): boolean | undefined;
    public getBoolean(key: string, defaultValue: boolean): boolean;
    public getBoolean(key: string, defaultValue?: boolean): boolean | undefined {
        const value: string | undefined = this.getString(key);

        if (value != null) {
            return BooleanParser.WEAK.parse(value);
        }

        return defaultValue;
    }

    public getFloat(key: string): number | undefined;
    public getFloat(key: string, defaultValue: number): number;
    public getFloat(key: string, defaultValue?: number): number | undefined {
        const value: ToString | undefined = this.getFirst(key);

        if (value != null) {
            return FloatParser.WEAK.parse(value.toString());
        }

        return defaultValue;
    }

    public *getFloats(key: string): Iterable<number> {
        const values: Iterable<ToString> = this.get(key);

        for (const value of values) {
            yield FloatParser.WEAK.parse(value.toString());
        }
    }

    public getInteger(key: string): number | undefined;
    public getInteger(key: string, defaultValue: number): number;
    public getInteger(key: string, defaultValue?: number): number | undefined {
        const value: ToString | undefined = this.getFirst(key);

        if (value != null) {
            return IntParser.WEAK.parse(value.toString());
        }

        return defaultValue;
    }

    public *getIntegers(key: string): Iterable<number> {
        const values: Iterable<ToString> = this.get(key);

        for (const value of values) {
            yield IntParser.WEAK.parse(value.toString());
        }
    }

    public getString(key: string): string | undefined;
    public getString(key: string, defaultValue: string): string;
    public getString(key: string, defaultValue?: string): string | undefined {
        const value: ToString | undefined = this.getFirst(key);

        if (value != null) {
            return value.toString();
        }

        return defaultValue;
    }

    public *getStrings(key: string): Iterable<string> {
        const values: Iterable<ToString> = this.get(key);

        for (const value of values) {
            yield value.toString();
        }
    }
}
