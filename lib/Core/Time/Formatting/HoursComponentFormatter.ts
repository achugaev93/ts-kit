import {TimeComponentFormatterBase} from './TimeComponentFormatterBase';
import DateTime from '../DateTime';
import DateTimeFormatInfo from '../DateTimeFormatInfo';
import TimeSpan from '../TimeSpan';
import TextTransform from '../../../System/Text/TextTransform';


export default class HoursComponentFormatter extends TimeComponentFormatterBase {
    public static readonly instance: HoursComponentFormatter = new HoursComponentFormatter();


    protected _entryPattern: RegExp = /^(H+|h+)$/;


    public formatDateTime(dateTime: DateTime, format: string, formatInfo: DateTimeFormatInfo): string {
        return this.formatHours(dateTime.hours, format, formatInfo);
    }


    public formatTimeSpan(timeSpan: TimeSpan, format: string, formatInfo: DateTimeFormatInfo): string {
        return this.formatHours(timeSpan.hours, format, formatInfo);
    }


    // formatInfo may contain information about hours representation for specific culture.

    protected formatHours(hours: number, format: string, formatInfo: DateTimeFormatInfo): string {
        let targetLength = format.length;

        switch (format[0]) {
            // Hours in 24-hours format
            case 'H':
                return TextTransform.padStart(hours.toString(), targetLength, '0');

            // Hours in 12-hours format
            case 'h':
                return TextTransform.padStart((hours % 12).toString(), targetLength, '0');
        }
    }
}
