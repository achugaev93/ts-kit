import {ConfigurationDecorator} from './ConfigurationDecorator';
import {Key} from '../object-model/attributes/Key';
import {Type} from '../Type';
import {Class} from '../reflection/Class';


export class ModuleDecorator extends ConfigurationDecorator {
    public static readonly COMPONENTS: Key<Array<Type<object>>> = new Key('Module components');
    public static readonly DEPENDS_ON: Key<Array<Type<object>>> = new Key('Module dependencies');

    private readonly _components: Array<Type<object>>;
    private readonly _dependsOn: Array<Type<object>>;


    public constructor(components: Array<Type<object>>, dependsOn: Array<Type<object>> = []) {
        super();

        this._components = components;
        this._dependsOn = dependsOn;
    }


    protected onClass(klass: Class<any>): void {
        super.onClass(klass);

        klass.decorate(ModuleDecorator);
        klass.setAttribute(ModuleDecorator.COMPONENTS, this._components);
        klass.setAttribute(ModuleDecorator.DEPENDS_ON, this._dependsOn);
    }
}
