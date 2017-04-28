import {EventEmitter} from '../Events/EventEmitter';
import {ErrorEvent} from '../Events/ErrorEvent';
import {TaskEventType} from './types';
import {TaskEvent} from './TaskEvent';
import {InvalidOperationException} from '../Exceptions/InvalidOperationException';
import {AsyncResult} from '../types';


export abstract class Task<T> extends EventEmitter {
    private _isComplete: boolean = false;
    private _isPending: boolean = false;
    private _isResolved: boolean = false;
    private _isRejected: boolean = false;
    private _isAborted: boolean = false;
    private _result: T;
    private _error: Error;


    public get result(): T {
        return this._result;
    }


    public get error(): Error {
        return this._error;
    }


    public get isPending(): boolean {
        return this._isPending;
    }


    public get isComplete(): boolean {
        return this._isComplete;
    }


    public get isResolved(): boolean {
        return this._isResolved;
    }


    public get isRejected(): boolean {
        return this._isRejected;
    }


    public get isAborted(): boolean {
        return this._isAborted;
    }


    public async start(): AsyncResult<void> {
        if (this.isPending) {
            throw new InvalidOperationException('Task already in progress.');
        }

        this.ensureTaskIsNotComplete();

        this._isPending = true;
        this._isComplete = false;

        await this.execute();
    }


    public abort(): void {
        this.ensureTaskIsNotComplete();

        this._isPending = false;
        this._isComplete = true;
        this._isAborted = true;

        this.notify(TaskEvent.ABORT);
    }


    protected abstract async execute(): AsyncResult<void>;


    protected resolve(result: T): void {
        this._isPending = false;
        this._isComplete = true;
        this._isResolved = true;
        this._result = result;

        this.notify(TaskEvent.COMPLETE);
    }


    protected reject(error: Error): void {
        this._isPending = false;
        this._isComplete = true;
        this._isRejected = true;
        this._error = error;

        this.dispatchEvent(new ErrorEvent(error));
    }


    protected ensureTaskIsNotComplete(): void {
        if (this.isComplete) {
            if (this.error) {
                throw new InvalidOperationException('Task already complete (with error).');
            } else {
                throw new InvalidOperationException('Task already complete (successfully).');
            }
        }
    }


    protected notify(eventType: TaskEventType): void {
        this.dispatchEvent(new TaskEvent(eventType, this));
    }
}
