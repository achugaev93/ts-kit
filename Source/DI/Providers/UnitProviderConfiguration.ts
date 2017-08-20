import {Constructor} from '../../types';
import {UnitFactoryFunction} from '../Decorators/types';
import {IUnitConfiguration} from '../Decorators/IUnitConfiguration';
import {Assert} from '../../Assertion/Assert';
import {ProvidersListValidator} from './ProvidersListValidator';


export class UnitProviderConfiguration<T> {
    private readonly providersListValidator: ProvidersListValidator = ProvidersListValidator.instance;

    public readonly type: Constructor<T>;
    public readonly isSingleton: boolean;
    public readonly factory: UnitFactoryFunction<T> | null;
    public readonly providers: Array<Constructor<any>>;


    public constructor(type: Constructor<T>, configuration: IUnitConfiguration<T>) {
        Assert.argument('type', type).notNull();
        Assert.argument('configuration', configuration).notNull();

        const {isSingleton = false, providers = [], factory = null} = configuration;

        this.providersListValidator.validate(providers);

        this.type = type;
        this.isSingleton = isSingleton;
        this.providers = providers;
        this.factory = factory;
    }
}
