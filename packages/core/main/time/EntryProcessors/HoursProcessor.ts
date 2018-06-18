import {DateTime} from '../DateTime';
import {TimeSpan} from '../TimeSpan';
import {DateTimeFormatInfo} from '../DateTimeFormatInfo';
import {TimeEntryProcessor} from './TimeEntryProcessor';
import {StringUtils} from '../../text/StringUtils';
import {StringPool} from '../../StringPool';
import {Singleton} from '../../stereotype/Singleton';


@Singleton
export class HoursProcessor extends TimeEntryProcessor {

    protected entryPattern: RegExp = /^(H+|h+)$/;


    public formatDateTime(dateTime: DateTime, format: string, formatInfo: DateTimeFormatInfo): string {
        return this.formatHours(dateTime.hours, format, formatInfo);
    }


    public formatTimeSpan(timeSpan: TimeSpan, format: string, formatInfo: DateTimeFormatInfo): string {
        return this.formatHours(timeSpan.hours, format, formatInfo);
    }


    public parseDateTime(
        value: string,
        formatEntry: string,
        formatInfo: DateTimeFormatInfo,
        dateBuilder: DateTime.Builder
    ): void {
        dateBuilder.hours = parseInt(value, 10);
    }


    // formatInfo may contain information about hours representation for specific culture.

    protected formatHours(hours: number, format: string, formatInfo: DateTimeFormatInfo): string {
        let targetLength = format.length;

        switch (format[0]) {
            // Hours in 24-hours format
            case 'H':
                return StringUtils.padStart(hours.toString(), targetLength, '0');

            // Hours in 12-hours format
            case 'h':
                return StringUtils.padStart((hours % 12).toString(), targetLength, '0');

            default:
                return StringPool.BLANK;
        }
    }
}
