import {Assert} from './Assert';
import {Module} from '@monument/core/main/stereotype/Module';
import {DeepEqualityComparator} from 'core/main/utils/comparison/DeepEqualityComparator';


@Module({
    components: [
        Assert,
        DeepEqualityComparator
    ]
})
export class AssertionModule {

}
