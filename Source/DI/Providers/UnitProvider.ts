import {UnitProviderConfiguration} from './UnitProviderConfiguration';
import {Assert} from '../../Assertion/Assert';
import {UnitFactoryFunction} from '../Decorators/types';
import {Container} from '../Container/Container';
import {UnitReflection} from '../Reflections/UnitReflection';
import {Constructor} from '../../types';
import {PropertyDefinitionCollection} from '../../Language/Reflection/PropertyDefinitionCollection';


export abstract class UnitProvider<T> {
    public readonly configuration: UnitProviderConfiguration<T>;


    public constructor(configuration: UnitProviderConfiguration<T>) {
        Assert.argument('configuration', configuration).notNull();

        this.configuration = configuration;
    }


    public abstract getInstance(container: Container): T;


    protected createInstance(container: Container): T {
        const args: any[] = this.getDependencies(container);
        const factory: UnitFactoryFunction<T> | null = this.configuration.factory;
        const reflection: UnitReflection<T> = new UnitReflection(this.configuration.type);
        const properties: PropertyDefinitionCollection = reflection.getAllPropertyDefinitions();

        let instance: T;

        if (factory != null) {
            instance = factory(...args);
        } else {
            instance = new this.configuration.type(...args);
        }

        for (let {name, type} of properties) {
            instance[name] = container.get(type);
        }

        return instance;
    }


    protected getDependencies(container: Container): any[] {
        return this.configuration.providers.map((token: Constructor<any>): any => {
            return container.get(token);
        });
    }
}
