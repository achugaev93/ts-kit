import {Task} from './Task';
import {IDisposable} from '../types';
import {Queue} from '../Collections/Queue';
import {TaskEvent} from './TaskEvent';
import {assertArgumentBounds, assertArgumentNotNull} from '../Assertion/Assert';


export class TaskQueue implements IDisposable {
    private _queue: Queue<Task<any>> = new Queue<Task<any>>();
    private _isDisposed: boolean = false;
    private _concurrentTasksLimit: number;
    private _runningTasksCount: number = 0;


    public get concurrentTasksLimit(): number {
        return this._concurrentTasksLimit;
    }


    public get isBusy(): boolean {
        return this._runningTasksCount > 0;
    }


    public get isIdle(): boolean {
        return this._runningTasksCount === 0;
    }


    public get isEmpty(): boolean {
        return this._queue.length === 0;
    }


    public get isDisposed(): boolean {
        return this._isDisposed;
    }


    protected get canRunOneMoreTask(): boolean {
        return !this.isDisposed && !this.isEmpty && this._runningTasksCount < this._concurrentTasksLimit;
    }


    public constructor(concurrentTasksLimit: number = 1) {
        assertArgumentNotNull('concurrentTasksLimit', concurrentTasksLimit);
        assertArgumentBounds('concurrentTasksLimit', concurrentTasksLimit, 1, Infinity);

        this._concurrentTasksLimit = concurrentTasksLimit;
    }


    public addTask(task: Task<any>): void {
        task.addEventListener(TaskEvent.COMPLETE, () => {
            this.tryRunNextTask();
        }, true);

        task.addEventListener(TaskEvent.ERROR, () => {
            this.tryRunNextTask();
        }, true);

        task.addEventListener(TaskEvent.ABORT, () => {
            this.tryRunNextTask();
        }, true);

        this._queue.enqueue(task);
        this.tryRunNextTask();
    }


    public dispose(): void {
        this._isDisposed = true;

        for (let task of this._queue) {
            task.abort();
        }

        this._queue.clear();
    }


    protected tryRunNextTask(): void {
        if (this.canRunOneMoreTask) {
            let task: Task = this._queue.dequeue();

            task.start();
        }
    }
}