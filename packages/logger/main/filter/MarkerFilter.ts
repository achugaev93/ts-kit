import {Marker} from '../marker/Marker';
import {LogEvent} from '../event/LogEvent';
import {AbstractFilter} from './AbstractFilter';
import {FilterDecision} from './FilterDecision';


export class MarkerFilter extends AbstractFilter {
    private readonly _marker: Marker;


    public constructor(marker: Marker) {
        super();

        this._marker = marker;
    }


    public async decide(message: LogEvent): Promise<FilterDecision> {
        if (message.marker == null) {
            return FilterDecision.NEUTRAL;
        }

        if (message.marker.isInstanceOf(this._marker)) {
            return FilterDecision.ACCEPT;
        } else {
            return FilterDecision.DENY;
        }
    }
}
