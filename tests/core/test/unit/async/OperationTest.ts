import {Assert} from '@monument/test-drive/main/assert/Assert';
import {Test} from '@monument/test-drive/main/decorators/Test';
import {Exception} from '@monument/core/main/exceptions/Exception';
import {InvalidOperationException} from '@monument/core/main/exceptions/InvalidOperationException';
import {TestOperation} from './support/TestOperation';


export class OperationTest {

    @Test
    public async 'start() complete task with result'(assert: Assert) {
        let task: TestOperation<string> = new TestOperation('OK');

        await task.run();

        assert.equals(task.result, 'OK');
        assert.equals(task.error, undefined);
        assert.true(task.isCompleted);
        assert.true(task.isResolved);
        assert.false(task.isRejected);
    }


    @Test
    public async 'start() fail task with error'(assert: Assert) {
        const error: Exception = new InvalidOperationException('Fake error');
        const task: TestOperation<never | undefined> = new TestOperation(undefined, error);

        await task.run();

        assert.equals(task.result, undefined);
        assert.equals(task.error, error);
        assert.true(task.isCompleted);
        assert.false(task.isResolved);
        assert.true(task.isRejected);
    }
}
