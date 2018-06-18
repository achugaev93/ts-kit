import {Singleton} from '../stereotype/Singleton';
import {EqualityComparator} from '../EqualityComparator';
import {Comparator} from '../Comparator';
import {ComparisonResult} from '../ComparisonResult';


@Singleton
export class PreserveCaseComparator implements EqualityComparator<string>, Comparator<string> {

    public equals(current: string, other: string): boolean {
        return current === other;
    }


    public compare(current: string, other: string): ComparisonResult {
        if (current > other) {
            return ComparisonResult.GREATER;
        }

        if (current < other) {
            return ComparisonResult.LESS;
        }

        return ComparisonResult.EQUALS;
    }
}
