import { Builder, ToString } from '@monument/core';
import { Uri } from './Uri';
import {
  UriComponents,
  ReadOnlyQueryParameters,
  QueryParametersObject
} from '@monument/contracts';
import { QueryParameters } from './QueryParameters';

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

  get fragment(): string | undefined {
    return this._fragment;
  }

  set fragment(fragment: string | undefined) {
    this._fragment = fragment;
  }

  get host(): string | undefined {
    return this._host;
  }

  set host(host: string | undefined) {
    this._host = host;
  }

  get password(): string | undefined {
    return this._password;
  }

  set password(password: string | undefined) {
    this._password = password;
  }

  get path(): string | undefined {
    return this._path;
  }

  set path(path: string | undefined) {
    this._path = path;
  }

  get port(): number | undefined {
    return this._port;
  }

  set port(port: number | undefined) {
    this._port = port;
  }

  get queryParameters(): ReadOnlyQueryParameters {
    return this._queryParameters;
  }

  get schema(): string | undefined {
    return this._schema;
  }

  set schema(schema: string | undefined) {
    this._schema = schema;
  }

  get userName(): string | undefined {
    return this._userName;
  }

  set userName(userName: string | undefined) {
    this._userName = userName;
  }

  constructor();
  constructor(components: UriComponents);
  constructor(components?: UriComponents) {
    if (components) {
      this.schema = components.schema;
      this.userName = components.userName;
      this.password = components.password;
      this.host = components.host;
      this.port = components.port;
      this.path = components.path;
      this.fragment = components.fragment;

      if (components.queryParameters) {
        this._queryParameters.putAll(components.queryParameters);
      }
    }
  }

  addParameter(name: string, value: ToString): boolean {
    return this._queryParameters.put(name, value);
  }

  build(): Uri {
    return new Uri(this);
  }

  clearParameters(): boolean {
    return this._queryParameters.clear();
  }

  getParameter(name: string): ToString | undefined;

  getParameter(name: string, defaultValue: ToString): ToString;

  getParameter(name: string, defaultValue?: ToString): ToString | undefined {
    const value: ToString | undefined = this._queryParameters.getFirst(name);

    if (value != null) {
      return value;
    }

    if (defaultValue != null) {
      return defaultValue;
    }
  }

  hasParameter(name: string): boolean;

  hasParameter(name: string, value: ToString): boolean;

  hasParameter(name: string, value?: ToString): boolean {
    if (value == null) {
      return this._queryParameters.containsKey(name);
    } else {
      return this._queryParameters.containsEntry(name, value);
    }
  }

  removeParameter(name: string): boolean;

  removeParameter(name: string, value: ToString): boolean;

  removeParameter(name: string, value?: ToString): boolean {
    if (value == null) {
      return this._queryParameters.remove(name) != null;
    } else {
      return this._queryParameters.removeIf(name, value);
    }
  }

  removeParameters(values: QueryParametersObject): boolean {
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

  setParameter(name: string, newValue: ToString): boolean {
    const oldValues: ToString[] = [...this._queryParameters.get(name)];

    if (oldValues.length === 1 && oldValues[0].toString() === newValue.toString()) {
      return false;
    }

    this._queryParameters.remove(name);

    return this._queryParameters.put(name, newValue);
  }

  setParameters(values: QueryParametersObject): boolean {
    let changed: boolean = false;

    Object.entries(values).forEach(([key, value]) => {
      if (value != null) {
        if (this._queryParameters.put(key, value)) {
          changed = true;
        }
      }
    });

    return changed;
  }
}
