import {TimeComponentFormatterBase} from './TimeComponentFormatterBase';
import DateTime from '../DateTime';
import DateTimeFormatInfo from '../DateTimeFormatInfo';
import TimeSpan from '../TimeSpan';
import TextTransform from '../../../System/Text/TextTransform';


export default class HoursComponentFormatter extends TimeComponentFormatterBase {
    public static readonly instance: HoursComponentFormatter = new HoursComponentFormatter();


    protected _entryPattern: RegExp = /^(m+)$/;


    public formatDateTime(dateTime: DateTime, format: string, formatInfo: DateTimeFormatInfo): string {
        return this.formatMinutes(dateTime.minutes, format, formatInfo);
    }


    public formatTimeSpan(timeSpan: TimeSpan, format: string, formatInfo: DateTimeFormatInfo): string {
        return this.formatMinutes(timeSpan.minutes, format, formatInfo);
    }


    // formatInfo may contain information about minutes representation for specific culture.

    protected formatMinutes(minutes: number, format: string, formatInfo: DateTimeFormatInfo): string {
        let targetLength = format.length;

        return TextTransform.padStart(minutes.toString(), targetLength, '0');
    }
}
