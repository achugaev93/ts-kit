import {GetterFunction} from '@monument/reflection/main/types';


export function Cached(target: object, key: string, descriptor: PropertyDescriptor): PropertyDescriptor | undefined {
    const getter: GetterFunction | undefined = descriptor.get;

    if (getter != null) {
        const prop = Symbol();

        return {
            ...descriptor,
            get: function (this: any) {
                if (!(prop in this)) {
                    this[prop] = getter.call(this);
                }

                return this[prop];
            }
        };
    }

    return undefined;
}
