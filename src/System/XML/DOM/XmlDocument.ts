import {XmlNode} from './XmlNode';
import {assertArgumentNotNull} from '../../../Core/Assertion/Assert';


export class XmlDocument extends XmlNode {
    private _version: string = '';
    private _encoding: string = '';
    
    
    public get version(): string {
        return this._version;
    }
    
    
    public set version(value: string) {
        assertArgumentNotNull('value', value);

        this._version = value;
    }
    
    
    public get encoding(): string {
        return this._encoding;
    }
    
    
    public set encoding(value: string) {
        assertArgumentNotNull('value', value);

        this._encoding = value;
    }
    
    
    public constructor() {
        super('');
    }
}
