import {TimeComponentFormatterBase} from './TimeComponentFormatterBase';
import DateTime from '../DateTime';
import TimeSpan from '../TimeSpan';
import DateTimeFormatInfo from '../DateTimeFormatInfo';
import InvalidOperationException from '../../Exceptions/InvalidOperationException';
import TextTransform from '../../../System/Text/TextTransform';


export default class MonthComponentFormatter extends TimeComponentFormatterBase {
    public static readonly instance: MonthComponentFormatter = new MonthComponentFormatter();


    protected _entryPattern: RegExp = /^(M(M{0,3}|G|g))$/;


    public formatDateTime(dateTime: DateTime, format: string, formatInfo: DateTimeFormatInfo): string {
        return this.formatMonth(dateTime.month, format, formatInfo);
    }


    public formatTimeSpan(timeSpan: TimeSpan, format: string, formatInfo: DateTimeFormatInfo): string {
        throw new InvalidOperationException(`Month component is not available for time span.`);
    }


    protected formatMonth(month: number, format: string, formatInfo: DateTimeFormatInfo): string {
        switch (format) {
            // Full name of month
            case 'MMMM':
                return formatInfo.monthNames[month];

            // Abbreviated name of month
            case 'MMM':
                return formatInfo.abbreviatedMonthNames[month];

            // Month number
            case 'MM':
            case 'M':
                let targetLength = format.length;

                return TextTransform.padStart((month + 1).toString(), targetLength, '0');

            // Full genitive name of month
            case 'MG':
                return formatInfo.monthGenitiveNames[month];

            // Abbreviated genitive name of month
            case 'Mg':
                return formatInfo.abbreviatedMonthGenitiveNames[month];
        }
    }
}
