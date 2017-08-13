import {TimeComponentFormatterBase} from './TimeComponentFormatterBase';
import {DateTime} from '../DateTime';
import {DateTimeFormatInfo} from '../DateTimeFormatInfo';
import {InvalidOperationException} from '../../Exceptions/InvalidOperationException';
import {TimeSpan} from '../TimeSpan';
import {TextTransform} from '../../Text/TextTransform';
import {Assert} from '../../Assertion/Assert';
import {Singleton} from '../../DI/Decorators/Singleton';
import {Getter} from '../../DI/Decorators/Getter';


@Singleton()
export class YearFormatter extends TimeComponentFormatterBase {
    @Getter(TextTransform)
    private readonly textTransform: TextTransform;

    protected entryPattern: RegExp = /^(Y+)$/;


    public formatDateTime(dateTime: DateTime, format: string, formatInfo: DateTimeFormatInfo): string {
        Assert.argument('dateTime', dateTime).notNull();
        Assert.argument('format', format).notNull();
        Assert.argument('formatInfo', formatInfo).notNull();

        return this.formatYear(dateTime.year, format, formatInfo);
    }


    public formatTimeSpan(timeSpan: TimeSpan, format: string, formatInfo: DateTimeFormatInfo): string {
        throw new InvalidOperationException(`Years component is not available for time span.`);
    }


    // formatInfo may contain information about years representation for specific culture.

    protected formatYear(year: number, format: string, formatInfo: DateTimeFormatInfo): string {
        let targetLength = format.length;
        let formattedYear: string = this.textTransform.padEnd(year.toString(), targetLength, '0');

        return this.textTransform.clipEnd(formattedYear, targetLength);
    }
}
