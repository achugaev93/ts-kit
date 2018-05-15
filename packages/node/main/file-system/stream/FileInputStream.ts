import {InputStream} from '@monument/stream/main/InputStream';
import {Closeable} from '@monument/stream/main/Closeable';
import {Path} from '../../path/Path';
import {FileSize} from '../FileSize';


export interface FileInputStream extends InputStream<Buffer>, Closeable {
    readonly path: Path;
    readonly bytesRead: FileSize;
}
