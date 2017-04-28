import {StreamReader} from '../Stream/StreamReader';
import {AsyncResult} from '../../Core/types';
import {Encoding} from '../Text/Encoding';
import {Utf8Encoding} from '../Text/Utf8Encoding';
import {Stream} from '../Stream/Stream';
import {assertArgumentNotNull, assertArgumentType} from '../../Core/Assertion/Assert';


export class TextReader
    extends StreamReader<Stream<Buffer>, string> {

    private _encoding: Encoding = Utf8Encoding.instance;


    public get encoding(): Encoding {
        return this._encoding;
    }


    public set encoding(value: Encoding) {
        assertArgumentNotNull('value', value);
        assertArgumentType('value', value, Encoding);

        this._encoding = value;
    }


    protected async onRead(length: number): AsyncResult<string> {
        let currentPosition: number = this.sourceStream.position;
        let bytesToRead: number = this.encoding.getStringSize(length);
        let bytes: Buffer = await this.sourceStream.read(bytesToRead);
        let chunk: string = this.encoding.getString(bytes, 0, length);
        let chunkSize: number = this.encoding.getBytesCount(chunk);

        await this.sourceStream.seek(currentPosition + chunkSize);

        return chunk;
    }


    protected async onPause(): AsyncResult {
        // Stub
    }


    protected async onResume(): AsyncResult {
        // Stub
    }


    protected async onClose(): AsyncResult {
        this.sourceStream.close();
    }
}
