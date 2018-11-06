import {Builder, ReadOnlyList, ToString} from '@monument/core';
import {Uri} from './Uri';
import {UriComponents} from './UriComponents';
import {ReadOnlyQueryParameters} from './ReadOnlyQueryParameters';
import {QueryParameters} from './QueryParameters';
import {QueryParametersObject} from './QueryParametersObject';


/**
 * @since 0.0.1
 * @author Alex Chugaev
 * @final
 */
export class UriBuilder implements UriComponents, Builder<Uri> {
    private _schema?: string;
    private _userName?: string;
    private _password?: string;
    private _host?: string;
    private _port?: number;
    private _path?: string;
    private _fragment?: string;
    private readonly _queryParameters: QueryParameters = new QueryParameters();

    public get fragment(): string | undefined {
        return this._fragment;
    }

    public set fragment(fragment: string | undefined) {
        this._fragment = fragment;
    }

    public get host(): string | undefined {
        return this._host;
    }

    public set host(host: string | undefined) {
        this._host = host;
    }

    public get password(): string | undefined {
        return this._password;
    }

    public set password(password: string | undefined) {
        this._password = password;
    }

    public get path(): string | undefined {
        return this._path;
    }

    public set path(path: string | undefined) {
        this._path = path;
    }

    public get port(): number | undefined {
        return this._port;
    }

    public set port(port: number | undefined) {
        this._port = port;
    }

    public get queryParameters(): ReadOnlyQueryParameters {
        return this._queryParameters;
    }

    public get schema(): string | undefined {
        return this._schema;
    }

    public set schema(schema: string | undefined) {
        this._schema = schema;
    }

    public get userName(): string | undefined {
        return this._userName;
    }

    public set userName(userName: string | undefined) {
        this._userName = userName;
    }

    public addParameter(name: string, value: ToString): boolean {
        return this._queryParameters.put(name, value.toString());
    }

    public build(): Uri {
        return new Uri(this);
    }

    public containsParameter(name: string): boolean;
    public containsParameter(name: string, value: ToString): boolean;
    public containsParameter(name: string, value?: ToString): boolean {
        if (value == null) {
            return this._queryParameters.containsKey(name);
        } else {
            return this._queryParameters.containsEntry(name, value.toString());
        }
    }

    public getParameter(name: string): string | undefined;
    public getParameter(name: string, defaultValue: ToString): string;
    public getParameter(name: string, defaultValue?: ToString): string | undefined {
        const value: string | undefined = this._queryParameters.getFirst(name);

        if (value != null) {
            return value;
        }

        if (defaultValue != null) {
            return defaultValue.toString();
        }
    }

    public removeParameter(name: string): boolean;
    public removeParameter(name: string, value: ToString): boolean;
    public removeParameter(name: string, value?: ToString): boolean {
        if (value == null) {
            return this._queryParameters.remove(name) != null;
        } else {
            return this._queryParameters.removeIf(name, value.toString());
        }
    }

    public removeParameters(values: QueryParametersObject): boolean {
        let changed: boolean = false;

        Object.entries(values).forEach(([key, value]) => {
            if (value != null) {
                if (this.removeParameter(key, value)) {
                    changed = true;
                }
            }
        });

        return changed;
    }

    public setParameter(name: string, value: ToString): boolean {
        const values: ReadOnlyList<string> = this._queryParameters.get(name);

        if (values.length === 1 && values.getAt(0) === value.toString()) {
            return false;
        }

        this._queryParameters.remove(name);

        return this._queryParameters.put(name, value.toString());
    }

    public setParameters(values: QueryParametersObject): boolean {
        let changed: boolean = false;

        Object.entries(values).forEach(([key, value]) => {
            if (value != null) {
                if (this._queryParameters.put(key, value.toString())) {
                    changed = true;
                }
            }
        });

        return changed;
    }
}
