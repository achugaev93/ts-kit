import {Test} from '@monument/test-drive/main/decorators/Test';
import {Assert} from '@monument/test-drive/main/assert/Assert';
import {FunctionMock} from '@monument/test-drive/main/mock/FunctionMock';
import {ConfigurableEvent} from '../../main/ConfigurableEvent';
import {EventHandler} from '../../main/EventHandler';


export class ConfigurableEventTest {

    @Test
    public 'event handler invoked with event args'(assert: Assert) {
        const mock: FunctionMock<EventHandler<object, number>> = new FunctionMock();
        const target: object = {};
        const event: ConfigurableEvent<object, number> = new ConfigurableEvent();

        assert.equals(mock.calls.length, 0);

        assert.true(event.subscribe(mock.value));

        event.trigger(target, 123);

        assert.equals(mock.calls.length, 1);
        assert.true(mock.testCallArguments(0, [target, 123]));
    }


    @Test
    public 'event handler not invoked after being unsubscribed'(assert: Assert) {
        const mock: FunctionMock<EventHandler<object, number>> = new FunctionMock();
        const target: object = {};
        const event: ConfigurableEvent<object, number> = new ConfigurableEvent();

        assert.true(event.subscribe(mock.value));

        event.trigger(target, 123);

        assert.true(event.unsubscribe(mock.value));

        event.trigger(target, 456);

        assert.equals(mock.calls.length, 1);
        assert.true(mock.testCallArguments(0, [target, 123]));
    }


    @Test
    public 'event handlers detached when event is disposed'(assert: Assert) {
        const mock: FunctionMock<EventHandler<object, number>> = new FunctionMock();
        const target: object = {};
        const event: ConfigurableEvent<object, number> = new ConfigurableEvent();

        assert.true(event.subscribe(mock.value));

        event.trigger(target, 123);

        event.dispose();

        event.trigger(target, 456);

        assert.equals(mock.calls.length, 1);
        assert.true(mock.testCallArguments(0, [target, 123]));
    }
}
