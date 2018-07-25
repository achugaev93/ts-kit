import {ReadOnlyCollection} from '../../collection/ReadOnlyCollection';
import {ReadOnlySet} from '../../collection/ReadOnlySet';
import {Key} from './Key';
import {AttributeAccessor} from './AttributeAccessor';


export interface HierarchicalAttributeAccessor extends AttributeAccessor {
    parent: HierarchicalAttributeAccessor | undefined;
    readonly declaredAttributeKeys: ReadOnlySet<Key<any>>;

    getAttributeValues<T>(key: Key<T>): ReadOnlyCollection<T>;

    getDeclaredAttribute<T>(key: Key<T>): T | undefined;
    hasDeclaredAttribute<T>(key: Key<T>): boolean;
    removeDeclaredAttribute<T>(key: Key<T>): boolean;
}
