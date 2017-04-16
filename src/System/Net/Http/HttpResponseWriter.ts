import {AsyncResult} from '../../../Core/types';
import {ServerResponse} from 'http';
import {assertArgumentNotNull} from '../../../Core/Assertion/Assert';
import {callAsyncMethod} from '../../../Core/Async/Utils';
import HeadersCollection from './HeadersCollection';
import {StatusCode} from './StatusCode';
import {HttpContent} from './HttpContent';
import {StreamWriter} from '../../Stream/StreamWriter';
import HttpResponse from './HttpResponse';


export default class HttpResponseWriter extends StreamWriter<ServerResponse, Buffer> {

    public async send(response: HttpResponse): AsyncResult<void> {
        this.setStatus(response.statusCode, response.statusMessage);
        this.setHeaders(response.headers);

        if (response.content) {
            await this.writeContent(response.content);
        }

        await this.endResponse();
    }


    protected async onWrite(chunk: Buffer): AsyncResult<number> {
        await callAsyncMethod<void>(this.targetStream, 'write', chunk);

        return chunk.length;
    }


    private setStatus(statusCode: StatusCode, statusMessage: string = ''): void {
        this.targetStream.statusCode = statusCode;
        this.targetStream.statusMessage = statusMessage;
    }


    private setHeaders(headers: HeadersCollection): void {
        for (let {name, value} of headers) {
            this.targetStream.setHeader(name, value);
        }
    }


    private writeContent(content: HttpContent): AsyncResult<void> {
        assertArgumentNotNull('content', content);

        this.setHeaders(content.headers);

        return content.copyTo(this);
    }


    private endResponse(): AsyncResult<void> {
        return callAsyncMethod<void>(this.targetStream, 'end');
    }
}