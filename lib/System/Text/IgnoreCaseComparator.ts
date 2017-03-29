import {IEqualityComparator} from '../../Core/Collections/IEqualityComparator';
import {IComparator} from '../../Core/Collections/IComparator';
import {ComparisonResult} from '../../Core/types';
import {assertArgumentNotNull} from '../../Assertion/Assert';


export default class IgnoreCaseComparator implements IEqualityComparator<string>, IComparator<string> {
    public static readonly instance: IgnoreCaseComparator = new IgnoreCaseComparator();


    public equals(current: string, other: string): boolean {
        assertArgumentNotNull('current', current);
        assertArgumentNotNull('other', other);

        if (current.length !== other.length) {
            return false;
        }

        current = current.toLowerCase();
        other = other.toLowerCase();

        return current === other;
    }


    public compare(current: string, other: string): ComparisonResult {
        assertArgumentNotNull('current', current);
        assertArgumentNotNull('other', other);

        current = current.toLowerCase();
        other = other.toLowerCase();

        if (current > other) {
            return ComparisonResult.Greater;
        } else if (current < other) {
            return ComparisonResult.Less;
        } else {
            return ComparisonResult.Equals;
        }
    }
}
