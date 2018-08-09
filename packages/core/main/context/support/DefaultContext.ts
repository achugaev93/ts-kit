import {DefaultUnitFactory} from '../../unit/factory/support/DefaultUnitFactory';
import {UnitPostProcessor} from '../../unit/factory/configuration/UnitPostProcessor';
import {UnitFactoryPostProcessor} from '../../unit/factory/configuration/UnitFactoryPostProcessor';
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
import {AbstractLifecycle} from '../../lifecycle/AbstractLifecycle';
import {ArrayList} from '../../collection/mutable/ArrayList';
import {Type} from '../../Type';
import {InvalidStateException} from '../../exceptions/InvalidStateException';
import {InvocationContext} from '../InvocationContext';
import {Invokable} from '../../reflection/Invokable';
import {UnitException} from '../../unit/UnitException';
import {Sequence} from '../../collection/readonly/Sequence';


export class DefaultContext extends AbstractLifecycle implements ConfigurableContext, InvocationContext {
    private _parent: Context | undefined;

    private readonly _unitDefinitionReaders: ArrayList<UnitDefinitionReader> = new ArrayList();
    private readonly _unitDefinitionRegistry: DefaultUnitDefinitionRegistry = new DefaultUnitDefinitionRegistry();
    private readonly _unitFactory: DefaultUnitFactory = new DefaultUnitFactory(this._unitDefinitionRegistry);

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

    public constructor(parent?: Context) {
        super();

        this.parent = parent;

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
    }

    public containsUnit(unitType: Type<object>): boolean {
        return this._unitFactory.containsUnit(unitType);
    }

    public destroyUnit<T extends object>(unitType: Type<T>, instance: T): Promise<void> {
        return this._unitFactory.destroyUnit(unitType, instance);
    }

    public getUnit<T extends object>(request: UnitRequest<T> | Type<T>): Promise<T> {
        if (!this.isStarted) {
            throw new InvalidStateException('Unable to get unit from context that is not started.');
        }

        return this._unitFactory.getUnit(request);
    }

    public async initialize(): Promise<void> {
        this.setInitializing();

        await this.instantiatePostProcessors();
        await this.postProcessUnitDefinitionRegistry();
        await this.postProcessUnitFactory();

        this.setInitialized();
    }

    public async invoke(instance: object, invokable: Invokable): Promise<any> {
        const args: any[] = [];

        for (const parameter of invokable.parameters) {
            if (parameter.type == null) {
                throw new UnitException('Parameter type is not defined.');
            }

            const arg = await this.getUnit(parameter.type);

            args.push(arg);
        }

        return invokable.invoke(instance, args);
    }

    public scan(type: Type<object>): void {
        if (!this.isPending) {
            throw new InvalidStateException('Class scan allowed only in pending state before lifecycle methods called.');
        }

        for (const reader of this._unitDefinitionReaders) {
            reader.scan(type);
        }
    }

    public scanAll(types: Sequence<Type<object>>): void {
        for (const type of types) {
            this.scan(type);
        }
    }

    public async start(): Promise<void> {
        this.setStarting();

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

    protected addUnitDefinitionReader(reader: UnitDefinitionReader): void {
        this._unitDefinitionReaders.add(reader);
    }

    protected addUnitPostProcessor(postProcessor: UnitPostProcessor): void {
        this._unitFactory.addUnitPostProcessor(postProcessor);
    }

    private async instantiatePostProcessors(): Promise<void> {
        for (const type of this._unitDefinitionRegistryPostProcessorTypes) {
            this._unitDefinitionRegistryPostProcessors.add(
                await this.getUnit(type) as UnitDefinitionRegistryPostProcessor
            );
        }

        for (const type of this._unitFactoryPostProcessorTypes) {
            this._unitFactoryPostProcessors.add(
                await this.getUnit(type) as UnitFactoryPostProcessor
            );
        }

        for (const type of this._unitPostProcessorTypes) {
            this._unitPostProcessors.add(
                await this.getUnit(type) as UnitPostProcessor
            );
        }

        for (const postProcessor of this._unitPostProcessors) {
            this._unitFactory.addUnitPostProcessor(postProcessor);
        }
    }

    private async postProcessUnitDefinitionRegistry(): Promise<void> {
        for (const processor of this._unitDefinitionRegistryPostProcessors) {
            await processor[UnitDefinitionRegistryPostProcessor.postProcessUnitDefinitionRegistry](this._unitDefinitionRegistry);
        }
    }

    private async postProcessUnitFactory(): Promise<void> {
        for (const processor of this._unitFactoryPostProcessors) {
            await processor[UnitFactoryPostProcessor.postProcessUnitFactory](this._unitFactory);
        }
    }
}
