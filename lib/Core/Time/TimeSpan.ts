import {ICloneable, IFormattable, IComparable, ComparisonResult, IEquatable} from '../types';
import DateTimeFormatInfo from './DateTimeFormatInfo';


export default class TimeSpan implements
    ICloneable<TimeSpan>,
    IFormattable<TimeSpan>,
    IComparable<TimeSpan>,
    IEquatable<TimeSpan> {

    public static readonly millisecondsPerSecond: number = 1000;
    public static readonly millisecondsPerMinute: number = 60000;
    public static readonly millisecondsPerHour: number = 3600000;
    public static readonly millisecondsPerDay: number = 86400000;
    public static readonly zero: TimeSpan = new TimeSpan();


    public static fromDays(days: number): TimeSpan {
        return new TimeSpan(days, 0, 0, 0, 0);
    }


    public static fromHours(hours: number): TimeSpan {
        return new TimeSpan(0, hours, 0, 0, 0);
    }


    public static fromMinutes(minutes: number): TimeSpan {
        return new TimeSpan(0, 0, minutes, 0, 0);
    }


    public static fromSeconds(seconds: number): TimeSpan {
        return new TimeSpan(0, 0, 0, seconds, 0);
    }


    public static fromMilliseconds(milliseconds: number): TimeSpan {
        return new TimeSpan(0, 0, 0, 0, milliseconds);
    }


    public static fromTimestamp(timestamp: number): TimeSpan {
        let value: TimeSpan = new TimeSpan(0, 0, 0, 0, 0);

        value._timestamp = Math.floor(timestamp);

        return value;
    }


    private _timestamp: number = 0;


    public get days(): number {
        return Math.floor(this._timestamp / TimeSpan.millisecondsPerDay);
    }


    public get hours(): number {
        return Math.floor(this._timestamp / TimeSpan.millisecondsPerHour) % 24;
    }


    public get minutes(): number {
        return Math.floor(this._timestamp / TimeSpan.millisecondsPerMinute) % 60;
    }


    public get seconds(): number {
        return Math.floor(this._timestamp / TimeSpan.millisecondsPerSecond) % 60;
    }


    public get milliseconds(): number {
        return this._timestamp % 1000;
    }


    public get totalDays(): number {
        return this._timestamp / TimeSpan.millisecondsPerDay;
    }


    public get totalHours(): number {
        return this._timestamp / TimeSpan.millisecondsPerHour;
    }


    public get totalMinutes(): number {
        return this._timestamp / TimeSpan.millisecondsPerMinute;
    }


    public get totalSeconds(): number {
        return this._timestamp / TimeSpan.millisecondsPerSecond;
    }


    public get totalMilliseconds(): number {
        return this._timestamp;
    }


    public get isNegative(): boolean {
        return this._timestamp < 0;
    }


    public get duration(): TimeSpan {
        return TimeSpan.fromTimestamp(Math.abs(this._timestamp));
    }


    public constructor(
        days: number = 0,
        hours: number = 0,
        minutes: number = 0,
        seconds: number = 0,
        milliseconds: number = 0
    ) {
        this._timestamp += days * TimeSpan.millisecondsPerDay;
        this._timestamp += hours * TimeSpan.millisecondsPerHour;
        this._timestamp += minutes * TimeSpan.millisecondsPerMinute;
        this._timestamp += seconds * TimeSpan.millisecondsPerSecond;
        this._timestamp += milliseconds;

        this._timestamp = Math.floor(this._timestamp);
    }


    public add(value: TimeSpan): TimeSpan {
        return TimeSpan.fromTimestamp(this._timestamp + value._timestamp);
    }


    public subtract(value: TimeSpan): TimeSpan {
        return new TimeSpan(this._timestamp - value._timestamp);
    }


    public negate(): TimeSpan {
        return TimeSpan.fromTimestamp(-1 * this._timestamp);
    }


    public clone(): TimeSpan {
        return TimeSpan.fromTimestamp(this._timestamp);
    }


    public compareTo(other: TimeSpan): ComparisonResult {
        if (this._timestamp < other._timestamp) {
            return ComparisonResult.Less;
        } else if (this._timestamp > other._timestamp) {
            return ComparisonResult.Greater;
        } else {
            return ComparisonResult.Equals;
        }
    }


    public equals(other: TimeSpan): boolean {
        return this.compareTo(other) === ComparisonResult.Equals;
    }


    public toString(format: string, formatInfo: DateTimeFormatInfo): string {
        return formatInfo.format(format, this, formatInfo);
    }
}
