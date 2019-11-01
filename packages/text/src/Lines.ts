
export class Lines implements Iterable<string> {
  static LINE_PATTERN = /\r?\n|\r/g;

  private readonly _source: Array<string>;

  constructor(source: string) {
    this._source = source.split(Lines.LINE_PATTERN);
  }

  * [Symbol.iterator](): Iterator<string> {
    for (const line of this._source) {
      yield line;
    }
  }

  toArray(): Array<string> {
    return [...this];
  }
}
