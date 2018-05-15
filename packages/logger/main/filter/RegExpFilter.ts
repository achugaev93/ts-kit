import {LogEvent} from '../event/LogEvent';
import {AbstractFilter} from './AbstractFilter';
import {FilterDecision} from './FilterDecision';


export class RegExpFilter extends AbstractFilter {
    private readonly _pattern: RegExp;


    public constructor(pattern: RegExp) {
        super();

        this._pattern = pattern;
    }


    public async decide(event: LogEvent): Promise<FilterDecision> {
        return this._pattern.test(event.message.text) ? FilterDecision.ACCEPT : FilterDecision.DENY;
    }
}
