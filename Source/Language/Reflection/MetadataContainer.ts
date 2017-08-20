import {Dictionary} from '../../Collections/Dictionary';
import {MetadataToken} from './MetadataToken';


export class MetadataContainer extends Dictionary<MetadataToken, any> {
    public constructor(
        public readonly parentMetadata: MetadataContainer | null = null
    ) {
        super();
    }
}
