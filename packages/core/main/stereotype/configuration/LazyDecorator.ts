import {Decorator} from '../../reflection/Decorator';
import {Class} from '../../reflection/Class';
import {Method} from '../../reflection/Method';


export class LazyDecorator extends Decorator {

    protected onClass(klass: Class<any>): void {
        klass.decorate(LazyDecorator);
    }


    protected onMethod(klass: Class<any>, method: Method): void {
        method.decorate(LazyDecorator);
    }
}
