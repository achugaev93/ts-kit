import {GetInstance} from '@monument/core/Language/Decorators/GetInstance';
import {Map} from '../../collections/main/Map';
import {ReadOnlyCollection} from '../../collections/main/ReadOnlyCollection';
import {FormattableString} from '@monument/text/main/FormattableString';
import {DateTimeFormatInfo} from './DateTimeFormatInfo';
import {InvariantDateTimeFormatInfo} from './InvariantDateTimeFormatInfo';
import {DateTime} from './DateTime';
import {TimeEntryProcessorProvider} from './EntryProcessors/TimeEntryProcessorProvider';
import {TimeEntryProcessor} from './EntryProcessors/TimeEntryProcessor';


export class DateTimeParser {
    @GetInstance()
    public static readonly instance: DateTimeParser;


    private constructor() {}


    public parse(
        source: string,
        format: string,
        formatInfo: DateTimeFormatInfo = InvariantDateTimeFormatInfo.invariant
    ): DateTime {
        const template: FormattableString = new FormattableString(format);
        const formatEntries: ReadOnlyCollection<string> = template.uniqueEntries;
        const values: Map<string, string> = template.extractValues(source);
        const builder: DateTime.Builder = new DateTime.Builder();

        for (let formatEntry of formatEntries) {
            const formatter: TimeEntryProcessor = TimeEntryProcessorProvider.instance.getFormatter(formatEntry);
            const stringValue: string = values.get(formatEntry) as string;

            formatter.parseDateTime(stringValue, formatEntry, formatInfo, builder);
        }

        return builder.build();
    }
}
