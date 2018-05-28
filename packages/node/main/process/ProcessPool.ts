import {Delegate} from '@monument/core/main/decorators/Delegate';
import {RepeatableNumberGenerator} from '@monument/core/main/data/generator/RepeatableNumberGenerator';
import {ArrayList} from '@monument/collections/main/ArrayList';
import {Event} from '@monument/events/main/Event';
import {EventArgs} from '@monument/events/main/EventArgs';
import {ConfigurableEvent} from '@monument/events/main/ConfigurableEvent';
import {ChildProcess} from './ChildProcess';
import {ProcessMessage} from './ProcessMessage';
import {ProcessClosedEventArgs} from './ProcessClosedEventArgs';
import {ProcessExitedEventArgs} from './ProcessExitedEventArgs';
import {ProcessMessageReceivedEventArgs} from './ProcessMessageReceivedEventArgs';


export abstract class ProcessPool<TMessage> implements ChildProcess<TMessage> {
    private readonly _messageReceived: ConfigurableEvent<ChildProcess<TMessage>, ProcessMessageReceivedEventArgs<TMessage>> =
        new ConfigurableEvent();
    private readonly _disconnected: ConfigurableEvent<ChildProcess<TMessage>, EventArgs> = new ConfigurableEvent();
    private readonly _exited: ConfigurableEvent<ChildProcess<TMessage>, ProcessExitedEventArgs> = new ConfigurableEvent();
    private readonly _closed: ConfigurableEvent<ChildProcess<TMessage>, ProcessClosedEventArgs> = new ConfigurableEvent();

    private readonly _size: number;
    private readonly _processes: ArrayList<ChildProcess<TMessage>> = new ArrayList();
    private readonly _indexGenerator: RepeatableNumberGenerator;


    public get size(): number {
        return this._size;
    }


    public get messageReceived(): Event<ChildProcess<TMessage>, ProcessMessageReceivedEventArgs<TMessage>> {
        return this._messageReceived;
    }


    public get exited(): Event<ChildProcess<TMessage>, ProcessExitedEventArgs> {
        return this._exited;
    }


    public get closed(): Event<ChildProcess<TMessage>, ProcessClosedEventArgs> {
        return this._closed;
    }


    public get disconnected(): Event<ChildProcess<TMessage>, EventArgs> {
        return this._disconnected;
    }


    public get isKilled(): boolean {
        return this._processes.all((process) => {
            return process.isKilled;
        });
    }


    protected constructor(size: number) {
        this._size = size;
        this._indexGenerator = new RepeatableNumberGenerator(size);
    }


    public kill(signal?: NodeJS.Signals): void {
        this._processes.forEach((process) => {
            process.kill(signal);
        });
    }


    public async send(message: ProcessMessage<TMessage>): Promise<void> {
        const index: number = this._indexGenerator.next();
        const process: ChildProcess<TMessage> = this._processes.getAt(index);

        return process.send(message);
    }


    protected abstract createProcess(id: number): ChildProcess<TMessage>;


    /**
     * Creates processes pool of specified capacity.
     * This method must be called in constructor after all properties set.
     */
    protected initialize() {
        for (let id = 0; id < this._size; id++) {
            this._processes.add(this.getProcess(id));
        }
    }


    private getProcess(id: number): ChildProcess<TMessage> {
        const process: ChildProcess<TMessage> = this.createProcess(id);

        process.messageReceived.subscribe(this.onMessageReceived);
        process.disconnected.subscribe(this.onDisconnected);
        process.closed.subscribe(this.onClosed);
        process.exited.subscribe(this.onExited);

        return process;
    }


    @Delegate
    private onMessageReceived(target: ChildProcess<TMessage>, args: ProcessMessageReceivedEventArgs<TMessage>) {
        this._messageReceived.trigger(target, args);
    }


    @Delegate
    private onDisconnected(target: ChildProcess<TMessage>, args: EventArgs) {
        this._disconnected.trigger(target, args);
    }


    @Delegate
    private onClosed(target: ChildProcess<TMessage>, args: ProcessClosedEventArgs) {
        this._closed.trigger(target, args);
    }


    @Delegate
    private onExited(target: ChildProcess<TMessage>, args: ProcessExitedEventArgs) {
        this._exited.trigger(target, args);
    }
}
