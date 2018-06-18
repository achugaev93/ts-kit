import {Exception} from '../exceptions/Exception';
import {EventArgs} from './EventArgs';


export class ErrorEventArgs extends EventArgs {
    private readonly _error: Exception;


    public get error(): Exception {
        return this._error;
    }


    public constructor(error: Exception) {
        super();

        this._error = error;
    }
}
