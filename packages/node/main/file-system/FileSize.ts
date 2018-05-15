

export class FileSize {
    public static readonly KILOBYTE = 1024;
    public static readonly MEGABYTE = 1024 ** 2;
    public static readonly GIGABYTE = 1024 ** 3;
    public static readonly TERABYTE = 1024 ** 4;
    public static readonly PETABYTE = 1024 ** 5;
    public static readonly EXABYTE = 1024 ** 6;
    public static readonly ZETTABYTE = 1024 ** 7;
    public static readonly YOTTABYTE = 1024 ** 8;

    private readonly _length: number;


    public get bytes(): number {
        return this._length;
    }


    public get kilobytes(): number {
        return this._length / FileSize.KILOBYTE;
    }


    public get megabytes(): number {
        return this._length / FileSize.MEGABYTE;
    }


    public get gigabytes(): number {
        return this._length / FileSize.GIGABYTE;
    }


    public get terabytes(): number {
        return this._length / FileSize.TERABYTE;
    }


    public get petabytes(): number {
        return this._length / FileSize.PETABYTE;
    }


    public get exabytes(): number {
        return this._length / FileSize.EXABYTE;
    }


    public get zettabytes(): number {
        return this._length / FileSize.ZETTABYTE;
    }


    public get yottabytes(): number {
        return this._length / FileSize.YOTTABYTE;
    }


    public constructor(length: number) {
        this._length = length;
    }
}

