import EventEmitter from '../../Core/Events/EventEmitter';
import {IDisposable} from '../../Core/types';


export default class Component extends EventEmitter implements IDisposable {
    private _isDisposed: boolean = false;
    
    
    public get isDisposed(): boolean {
        return this._isDisposed;
    }
    
    
    public dispose(): void {
        this._isDisposed = true;
    }
}
