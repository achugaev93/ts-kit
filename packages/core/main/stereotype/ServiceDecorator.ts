import {Service} from './Service';
import {ComponentDecorator} from './ComponentDecorator';
import {Class} from '../reflection/Class';


export class ServiceDecorator extends ComponentDecorator {

    protected onClass(klass: Class<any>): void {
        super.onClass(klass);
        klass.decorate(Service);
    }
}
