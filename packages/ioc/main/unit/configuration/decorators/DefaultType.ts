import {Type} from '@monument/core/main/Type';
import {DecoratorTarget} from '../../../../../reflection/main/decorators/DecoratorTarget';
import {Target} from '../../../../../reflection/main/decorators/Target';
import {WithDecorator} from '@monument/reflection/main/decorators/WithDecorator';
import {WithAttribute} from '@monument/reflection/main/decorators/WithAttribute';
import {DefaultTypeConfiguration} from './DefaultTypeConfiguration';


export function DefaultType<T extends object>(type: Type<T>): ParameterDecorator {
    return function () {
        Target([DecoratorTarget.METHOD_PARAMETER, DecoratorTarget.CONSTRUCTOR_PARAMETER])(...arguments);
        WithDecorator(DefaultType)(...arguments);
        WithAttribute(
            DefaultTypeConfiguration.ATTRIBUTE_KEY,
            new DefaultTypeConfiguration(type)
        )(...arguments);
    };
}
