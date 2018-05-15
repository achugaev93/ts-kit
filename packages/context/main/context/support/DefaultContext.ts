import {Type} from '@monument/core/main/Type';
import {AbstractLifecycle} from '@monument/core/main/lifecycle/AbstractLifecycle';
import {Collection} from '@monument/collections/main/Collection';
import {ArrayList} from '@monument/collections/main/ArrayList';
import {DefaultUnitFactory} from '../../unit/factory/support/DefaultUnitFactory';
import {UnitPostProcessor} from '../../unit/factory/configuration/UnitPostProcessor';
import {UnitFactoryPostProcessor} from '../../unit/factory/configuration/UnitFactoryPostProcessor';
import {UnitDefinition} from '../../unit/definition/UnitDefinition';
import {UnitDefinitionReader} from '../../unit/definition/reader/UnitDefinitionReader';
import {UnitDefinitionRegistry} from '../../unit/definition/registry/UnitDefinitionRegistry';
import {UnitDefinitionRegistryPostProcessor} from '../../unit/definition/registry/configuration/UnitDefinitionRegistryPostProcessor';
import {DefaultUnitDefinitionRegistry} from '../../unit/definition/registry/DefaultUnitDefinitionRegistry';
import {ComponentUnitDefinitionReader} from '../../unit/definition/reader/ComponentUnitDefinitionReader';
import {ConfigurationUnitDefinitionReader} from '../../unit/definition/reader/ConfigurationUnitDefinitionReader';
import {PostProcessorUnitDefinitionReader} from '../../unit/definition/reader/PostProcessorUnitDefinitionReader';
import {UnitRequest} from '../../unit/factory/UnitRequest';
import {ContextAwareUnitPostProcessor} from '../configuration/support/ContextAwareUnitPostProcessor';
import {Context} from '../Context';
import {ConfigurableContext} from '../ConfigurableContext';


export class DefaultContext extends AbstractLifecycle implements ConfigurableContext {
    private _parent: Context | undefined;

    private readonly _unitDefinitionReaders: Collection<UnitDefinitionReader> = new ArrayList();
    private readonly _unitDefinitionRegistry: UnitDefinitionRegistry = new DefaultUnitDefinitionRegistry();
    private readonly _unitFactory: DefaultUnitFactory;

    private readonly _unitDefinitionRegistryPostProcessorTypes: ArrayList<Type<object>> = new ArrayList();
    private readonly _unitFactoryPostProcessorTypes: ArrayList<Type<object>> = new ArrayList();
    private readonly _unitPostProcessorTypes: ArrayList<Type<object>> = new ArrayList();

    private readonly _unitDefinitionRegistryPostProcessors: ArrayList<UnitDefinitionRegistryPostProcessor> = new ArrayList();
    private readonly _unitFactoryPostProcessors: ArrayList<UnitFactoryPostProcessor> = new ArrayList();
    private readonly _unitPostProcessors: ArrayList<UnitPostProcessor> = new ArrayList();


    public get parent(): Context | undefined {
        return this._parent;
    }


    public set parent(value: Context | undefined) {
        this._parent = value;

        if (value == null) {
            this._unitFactory.parent = undefined;
        } else {
            this._unitFactory.parent = value;
        }
    }


    protected get unitDefinitionRegistry(): UnitDefinitionRegistry {
        return this._unitDefinitionRegistry;
    }


    public constructor(parent?: Context, ...types: Array<Type<object>>) {
        super();

        this._unitFactory = new DefaultUnitFactory(this._unitDefinitionRegistry);

        this.addUnitDefinitionReader(
            new PostProcessorUnitDefinitionReader(
                this._unitDefinitionRegistry,
                this,
                this._unitPostProcessorTypes,
                this._unitFactoryPostProcessorTypes,
                this._unitDefinitionRegistryPostProcessorTypes
            )
        );

        this.addUnitDefinitionReader(
            new ComponentUnitDefinitionReader(
                this._unitDefinitionRegistry,
                this
            )
        );

        this.addUnitDefinitionReader(
            new ConfigurationUnitDefinitionReader(
                this._unitDefinitionRegistry,
                this
            )
        );

        this.addUnitPostProcessor(
            new ContextAwareUnitPostProcessor(
                this
            )
        );

        this.registerContext();

        this.parent = parent;

        for (const type of types) {
            this.scan(type);
        }
    }


    public async start(): Promise<void> {
        this.setStarting();

        await this.instantiatePostProcessors();
        await this.postProcessUnitDefinitionRegistry();
        await this.postProcessUnitFactory();
        await this._unitFactory.preInstantiateSingletons();

        this.setStarted();
    }


    public async stop(): Promise<void> {
        this.setStopping();

        for (const {key: type, value: definition} of this._unitDefinitionRegistry.unitDefinitions) {
            if (definition.isSingleton) {
                const instance: object = await this._unitFactory.getUnit(type);

                await this._unitFactory.destroyUnit(type, instance);
            }
        }

        this.setStopped();
    }


    public getUnit<T extends object>(request: UnitRequest<T> | Type<T>): Promise<T> {
        return this._unitFactory.getUnit(request);
    }


    public containsUnit(unitType: Type<object>): boolean {
        return this._unitFactory.containsUnit(unitType);
    }


    public destroyUnit<T extends object>(unitType: Type<T>, instance: T): Promise<void> {
        return this._unitFactory.destroyUnit(unitType, instance);
    }


    public scan(type: Type<object>): void {
        for (const reader of this._unitDefinitionReaders) {
            reader.scan(type);
        }
    }


    protected addUnitDefinitionReader(reader: UnitDefinitionReader): void {
        this._unitDefinitionReaders.add(reader);
    }


    protected addUnitPostProcessor(postProcessor: UnitPostProcessor): void {
        this._unitFactory.addUnitPostProcessor(postProcessor);
    }


    private async instantiatePostProcessors(): Promise<void> {
        this._unitDefinitionRegistryPostProcessors.addAll(
            await Promise.all(
                this._unitDefinitionRegistryPostProcessorTypes.select((type) => {
                    return this.getUnit(type) as Promise<UnitDefinitionRegistryPostProcessor>;
                })
            )
        );

        this._unitFactoryPostProcessors.addAll(
            await Promise.all(
                this._unitFactoryPostProcessorTypes.select((type) => {
                    return this.getUnit(type) as Promise<UnitFactoryPostProcessor>;
                })
            )
        );

        this._unitPostProcessors.addAll(
            await Promise.all(
                this._unitDefinitionRegistryPostProcessorTypes.select((type) => {
                    return this.getUnit(type) as Promise<UnitPostProcessor>;
                })
            )
        );

        for (const postProcessor of this._unitPostProcessors) {
            this._unitFactory.addUnitPostProcessor(postProcessor);
        }
    }


    private async postProcessUnitDefinitionRegistry(): Promise<void> {
        for (const processor of this._unitDefinitionRegistryPostProcessors) {
            await processor.postProcessUnitDefinitionRegistry(this._unitDefinitionRegistry);
        }
    }


    private async postProcessUnitFactory(): Promise<void> {
        for (const processor of this._unitFactoryPostProcessors) {
            await processor.postProcessUnitFactory(this._unitFactory);
        }
    }


    private registerContext() {
        const definition = new UnitDefinition();

        definition.isSingleton = true;

        this._unitDefinitionRegistry.registerUnitDefinition(DefaultContext, definition);
        this._unitFactory.registerSingleton(DefaultContext, this);
    }
}
