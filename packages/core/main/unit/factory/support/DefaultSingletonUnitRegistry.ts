import {Type} from '../../../Type';
import {ListMap} from '../../../collections/ListMap';
import {ReadOnlyMap} from '../../../collections/ReadOnlyMap';
import {SingletonUnitRegistry} from '../configuration/SingletonUnitRegistry';


export class DefaultSingletonUnitRegistry implements SingletonUnitRegistry {
    private readonly _singletons: ListMap<Type<object>, object> = new ListMap();


    public get singletons(): ReadOnlyMap<Type<object>, object> {
        return this._singletons;
    }


    public containsSingleton(unitType: Type<object>): boolean {
        return this._singletons.containsKey(unitType);
    }


    public getSingleton<T extends object>(unitType: Type<T>): T | undefined {
        return this._singletons.get(unitType) as T;
    }


    public registerSingleton<T extends object>(unitType: Type<T>, unitObject: T): void {
        this._singletons.put(unitType, unitObject);
    }
}
