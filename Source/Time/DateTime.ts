import {TimeSpan} from './TimeSpan';
import {ICloneable, IComparable, ComparisonResult, IEquatable, IFormattable} from '../types';
import {DateTimeFormatInfo} from './DateTimeFormatInfo';
import {Assert} from '../Assertion/Assert';
import {DAYS_OFFSET_PER_MONTH, DAYS_TO_MONTH_365, DAYS_TO_MONTH_366} from './types';
import {DayOfWeek} from './DayOfWeek';


export class DateTime implements ICloneable<DateTime>, IComparable<DateTime>, IEquatable<DateTime>, IFormattable {

    public static get now(): DateTime {
        return this.fromDate(new Date());
    }


    public static fromDate(date: Date): DateTime {
        Assert.argument('date', date).notNull();

        return this.fromTimestamp(date.getTime());
    }


    public static fromTimestamp(timestamp: number): DateTime {
        Assert.argument('timestamp', timestamp).notNull();

        let dateTime: DateTime = new DateTime();

        dateTime._date = new Date(timestamp);

        return dateTime;
    }


    public static isValidDateString(dateString: string): boolean {
        Assert.argument('dateString', dateString);

        return !isNaN(Date.parse(dateString));
    }


    public static isValidDate(date: Date): boolean {
        Assert.argument('date', date);

        return !isNaN(date.getTime());
    }


    public static isLeapYear(year: number): boolean {
        Assert.argument('year', year).notNull();

        if ((year & 3) !== 0) {
            return false;
        }

        return ((year % 100) !== 0 || (year % 400) === 0);
    }


    public static daysInMonth(year: number, month: number): number {
        Assert.argument('year', year).notNull();
        Assert.argument('month', month).notNull();

        let daysToMonth: number[] = this.isLeapYear(year) ? DAYS_TO_MONTH_366 : DAYS_TO_MONTH_365;

        return daysToMonth[month + 1] - daysToMonth[month];
    }


    private _date: Date;


    public get year(): number {
        return this._date.getFullYear();
    }


    public get month(): number {
        return this._date.getMonth();
    }


    public get dayOfMonth(): number {
        return this._date.getDate();
    }


    public get dayOfWeek(): DayOfWeek {
        return this._date.getDay();
    }


    public get dayOfYear(): number {
        let month = this.month;
        let dayOfMonth = this.dayOfMonth;
        let dayOfYear = DAYS_OFFSET_PER_MONTH[month] + dayOfMonth;

        if (month > 1 && DateTime.isLeapYear(this.year)) {
            dayOfYear++;
        }

        return dayOfYear;
    }


    public get hours(): number {
        return this._date.getHours();
    }


    public get minutes(): number {
        return this._date.getMinutes();
    }


    public get seconds(): number {
        return this._date.getSeconds();
    }


    public get milliseconds(): number {
        return this._date.getMilliseconds();
    }


    public get timezoneOffset(): TimeSpan {
        return new TimeSpan(0, 0, this._date.getTimezoneOffset());
    }


    public get date(): DateTime {
        return new DateTime(this.year, this.month, this.dayOfMonth);
    }


    public get timeOfDay(): TimeSpan {
        return new TimeSpan(0, this.hours, this.minutes, this.seconds, this.milliseconds);
    }


    public constructor(
        year: number = 0,
        month: number = 0,
        day: number = 0,
        hours: number = 0,
        minutes: number = 0,
        seconds: number = 0,
        milliseconds: number = 0
    ) {
        Assert.argument('year', year).notNull();
        Assert.argument('month', month).notNull();
        Assert.argument('day', day).notNull();
        Assert.argument('hours', hours).notNull();
        Assert.argument('minutes', minutes).notNull();
        Assert.argument('seconds', seconds).notNull();
        Assert.argument('milliseconds', milliseconds).notNull();

        this._date = new Date(year, month, day, hours, minutes, seconds, milliseconds);
    }


    public clone(): DateTime {
        return DateTime.fromTimestamp(this._date.getTime());
    }


    public compareTo(other: DateTime): ComparisonResult {
        Assert.argument('other', other).notNull();

        let currentTimeStamp: number = this._date.getTime();
        let otherTimeStamp: number = other._date.getTime();

        if (currentTimeStamp > otherTimeStamp) {
            return ComparisonResult.Greater;
        } else if (currentTimeStamp < otherTimeStamp) {
            return ComparisonResult.Less;
        } else {
            return ComparisonResult.Equals;
        }
    }


    public equals(other: DateTime): boolean {
        Assert.argument('other', other).notNull();

        return this.compareTo(other) === ComparisonResult.Equals;
    }


    public add(value: TimeSpan): DateTime {
        Assert.argument('value', value).notNull();

        return DateTime.fromTimestamp(this.toTimestamp() + value.totalMilliseconds);
    }


    public addMilliseconds(value: number): DateTime {
        Assert.argument('value', value).notNull();

        return this.add(new TimeSpan(0, 0, 0, 0, value));
    }


    public addSeconds(value: number): DateTime {
        Assert.argument('value', value).notNull();

        return this.add(new TimeSpan(0, 0, 0, value, 0));
    }


    public addMinutes(value: number): DateTime {
        Assert.argument('value', value).notNull();

        return this.add(new TimeSpan(0, 0, value, 0, 0));
    }


    public addHours(value: number): DateTime {
        Assert.argument('value', value).notNull();

        return this.add(new TimeSpan(0, value, 0, 0, 0));
    }


    public addDays(value: number): DateTime {
        Assert.argument('value', value).notNull();

        return this.add(new TimeSpan(value, 0, 0, 0, 0));
    }


    public addMonths(value: number): DateTime {
        Assert.argument('value', value).notNull();

        let currentYear: number = this.year;
        let currentMonth: number = this.month;
        let currentDayOfMonth: number = this.dayOfMonth;
        let newMonth: number = currentMonth - 1 + value;
        let days: number;

        if (newMonth >= 0) {
            currentMonth = Math.floor(newMonth % 12 + 1);
            currentYear = Math.floor(currentYear + newMonth / 12);
        } else {
            currentMonth = Math.floor(12 + (newMonth + 1) % 12);
            currentYear = Math.floor(currentYear + (newMonth - 11) / 12);
        }

        days = DateTime.daysInMonth(currentYear, currentMonth);

        if (currentDayOfMonth > days) {
            currentDayOfMonth = days;
        }

        return new DateTime(
            currentYear, currentMonth, currentDayOfMonth,
            this.hours, this.minutes, this.seconds, this.milliseconds
        );
    }


    public addYears(value: number): DateTime {
        Assert.argument('value', value).notNull();

        return this.addMonths(value * 12);
    }


    public getTimeSpanTo(other: DateTime): TimeSpan {
        Assert.argument('other', other).notNull();

        return TimeSpan.fromTimestamp(this.toTimestamp() - other.toTimestamp());
    }


    public subtract(value: TimeSpan): DateTime {
        Assert.argument('value', value).notNull();

        return DateTime.fromTimestamp(this.toTimestamp() - value.totalMilliseconds);
    }


    public toTimestamp(): number {
        return this._date.getTime();
    }


    public toUniversalTime(): DateTime {
        return new DateTime(
            this._date.getUTCFullYear(),
            this._date.getUTCMonth(),
            this._date.getUTCDate(),
            this._date.getUTCHours(),
            this._date.getUTCMinutes(),
            this._date.getUTCSeconds(),
            this._date.getUTCMilliseconds()
        );
    }


    public valueOf(): number {
        return this._date.getTime();
    }


    public toString(
        format: string = DateTimeFormatInfo.invariantInfo.fullDateTimePattern,
        formatInfo: DateTimeFormatInfo = DateTimeFormatInfo.invariantInfo
    ): string {
        Assert.argument('format', format).notNull();
        Assert.argument('formatInfo', formatInfo).notNull();

        return formatInfo.format(format, this, formatInfo);
    }


    public toLongDateString(formatInfo: DateTimeFormatInfo = DateTimeFormatInfo.invariantInfo): string {
        Assert.argument('formatInfo', formatInfo).notNull();

        return formatInfo.format(formatInfo.longDatePattern, this, formatInfo);
    }


    public toShortDateString(formatInfo: DateTimeFormatInfo = DateTimeFormatInfo.invariantInfo): string {
        Assert.argument('formatInfo', formatInfo).notNull();

        return formatInfo.format(formatInfo.shortDatePattern, this, formatInfo);
    }


    public toLongTimeString(formatInfo: DateTimeFormatInfo = DateTimeFormatInfo.invariantInfo): string {
        Assert.argument('formatInfo', formatInfo).notNull();

        return formatInfo.format(formatInfo.longTimePattern, this, formatInfo);
    }


    public toShortTimeString(formatInfo: DateTimeFormatInfo = DateTimeFormatInfo.invariantInfo): string {
        Assert.argument('formatInfo', formatInfo).notNull();

        return formatInfo.format(formatInfo.shortTimePattern, this, formatInfo);
    }
}
