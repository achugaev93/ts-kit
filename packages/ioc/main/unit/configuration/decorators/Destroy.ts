import {WithDecorator} from '@monument/reflection/main/decorators/WithDecorator';
import {Target} from '../../../../../reflection/main/decorators/Target';
import {DecoratorTarget} from '../../../../../reflection/main/decorators/DecoratorTarget';


export function Destroy(): MethodDecorator {
    return function () {
        Target([DecoratorTarget.METHOD])(...arguments);
        WithDecorator(Destroy)(...arguments);
    };
}
