import {ReadOnlyMap} from '@monument/collections-core/main/ReadOnlyMap';


export interface SingletonUnitRegistry {
    /**
     * Return the names of singleton units registered in this registry.
     *
     * Only checks already instantiated singletons; does not return names for singleton unit definitions
     * which have not been instantiated yet.
     *
     * The main purpose of this method is to check manually registered singletons.
     *
     * Can also be used to check which singletons defined by a unit definition have already been created.
     */
    readonly registeredSingletons: ReadOnlyMap<string, object>;
    readonly singletonCount: number;

    containsSingleton(unitName: string): boolean;
    getSingleton(unitName: string): object | undefined;
    registerSingleton(unitName: string, unitObject: object): void;
}
