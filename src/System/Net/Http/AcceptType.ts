

import {assertArgumentBounds, assertArgumentNotNull} from '../../../Core/Assertion/Assert';
export class AcceptType {
    private _mimeType: string;
    private _priority: number;


    public get mimeType(): string {
        return this._mimeType;
    }


    public get priority(): number {
        return this._priority;
    }


    public constructor(mimeType: string, priority: number) {
        assertArgumentNotNull('mimeType', mimeType);
        assertArgumentNotNull('priority', priority);
        assertArgumentBounds('priority', priority, 0, 1);

        this._mimeType = mimeType;
        this._priority = priority;
    }
}
