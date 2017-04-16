import FileSystem from '../../../../src/System/IO/FileSystem';
import FileSystemFixtureCollection from './fixtures/FileSystemFixtureCollection';
import ArgumentNullException from '../../../../src/Core/Exceptions/ArgumentNullException';
import DateTime from '../../../../src/Core/Time/DateTime';
import Utf8Encoding from '../../../../src/System/Text/Utf8Encoding';
import {FileMode} from '../../../../src/System/IO/FileMode';
import {FileSystemEntry} from '../../../../src/System/IO/FileSystemEntry';
import {AccessPermissions} from '../../../../src/System/IO/AccessPermissions';
import {IFileSystem} from '../../../../src/System/IO/IFileSystem';
import asyncExpect from '../../../helpers/async-expect';
import {FileDescriptor} from '../../../../src/System/IO/types';
import {FileSystemEntryType} from '../../../../src/System/IO/FileSystemEntryType';


describe(`FileSystem`, () => {
    let fileSystem: IFileSystem = new FileSystem();
    let fixtures: FileSystemFixtureCollection = new FileSystemFixtureCollection('/playground');


    beforeEach(async () => {
        await fixtures.createAll();
    });


    afterEach(async () => {
        await fixtures.destroyAll();
    });


    describe(`#open()`, () => {
        it(`throws if 'fullName' argument is not defined`, async () => {
            await asyncExpect(async () => {
                await fileSystem.open(undefined);
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'fullName' argument is null`, async () => {
            await asyncExpect(async () => {
                await fileSystem.open(null);
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'fileMode' argument is null`, async () => {
            await asyncExpect(async () => {
                await fileSystem.open(fixtures.singleLineTextFile.fileName, null);
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'accessPermissions' argument is null`, async () => {
            await asyncExpect(async () => {
                await fileSystem.open(fixtures.singleLineTextFile.fileName, FileMode.Read, null);
            }).toThrowError(ArgumentNullException);
        });

        it(`returns file descriptor represented as positive integer`, async () => {
            let fileDescriptor: FileDescriptor = await fileSystem.open(fixtures.singleLineTextFile.fileName);

            expect(typeof fileDescriptor).toBe('number');
            expect(fileDescriptor).toBeGreaterThan(0);

            await fileSystem.close(fileDescriptor);
        });
    });


    describe(`#read()`, () => {
        it(`throws if 'fileDescriptor' argument is not defined`, async () => {
            await asyncExpect(async () => {
                return fileSystem.read(undefined, 0, 1);
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'fileDescriptor' argument is null`, async () => {
            await asyncExpect(async () => {
                return fileSystem.read(null, 0, 1);
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'position' argument is not defined`, async () => {
            await asyncExpect(async () => {
                return fileSystem.read(1, undefined, 1);
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'position' argument is null`, async () => {
            await asyncExpect(async () => {
                return fileSystem.read(1, null, 1);
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'length' argument is not defined`, async () => {
            await asyncExpect(async () => {
                return fileSystem.read(1, 0, undefined);
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'length' argument is null`, async () => {
            await asyncExpect(async () => {
                return fileSystem.read(1, 0, null);
            }).toThrowError(ArgumentNullException);
        });

        it(`returns specified amount of bytes read from file`, async () => {
            let fileDescriptor: FileDescriptor = await fileSystem.open(fixtures.singleLineTextFile.fileName);
            let bytes: Buffer = await fileSystem.read(fileDescriptor, 0, 3);

            expect(bytes).toBeInstanceOf(Buffer);
            expect(bytes.length).toBe(3);
            expect(Utf8Encoding.instance.getString(bytes)).toBe('123');

            await fileSystem.close(fileDescriptor);
        });
    });


    describe(`#write()`, () => {
        it(`throws if 'fileDescriptor' argument is not defined`, async () => {
            await asyncExpect(async () => {
                return fileSystem.write(undefined, 0, Utf8Encoding.instance.getBytes('abc'));
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'fileDescriptor' argument is null`, async () => {
            await asyncExpect(async () => {
                return fileSystem.write(null, 0, Utf8Encoding.instance.getBytes('abc'));
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'position' argument is not defined`, async () => {
            await asyncExpect(async () => {
                return fileSystem.write(1, undefined, Utf8Encoding.instance.getBytes('abc'));
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'position' argument is null`, async () => {
            await asyncExpect(async () => {
                return fileSystem.write(1, null, Utf8Encoding.instance.getBytes('abc'));
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'buffer' argument is not defined`, async () => {
            await asyncExpect(async () => {
                return fileSystem.write(1, 0, undefined);
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'buffer' argument is null`, async () => {
            await asyncExpect(async () => {
                return fileSystem.write(1, 0, null);
            }).toThrowError(ArgumentNullException);
        });

        it(`writes given bytes to file`, async () => {
            let fileName: string = fixtures.singleLineTextFile.fileName;
            let bytes: Buffer = Utf8Encoding.instance.getBytes('abc');
            let fileDescriptor: FileDescriptor = await fileSystem.open(fileName);
            let bytesWritten: number = await fileSystem.write(fileDescriptor, 0, bytes);

            expect(bytesWritten).toBe(bytes.length);

            let fileContents: Buffer = await fileSystem.read(fileDescriptor, 0, 10);

            expect(fileContents).toBeInstanceOf(Buffer);
            expect(Utf8Encoding.instance.getString(fileContents)).toBe('abc4567890');

            await fileSystem.close(fileDescriptor);
        });

        it(`writes given bytes to file at specified position`, async () => {
            let fileName: string = fixtures.singleLineTextFile.fileName;
            let bytes: Buffer = Utf8Encoding.instance.getBytes('abc');
            let fileDescriptor: FileDescriptor = await fileSystem.open(fileName);
            let bytesWritten: number = await fileSystem.write(fileDescriptor, 3, bytes);

            expect(bytesWritten).toBe(bytes.length);

            let fileContents: Buffer = await fileSystem.read(fileDescriptor, 0, 10);

            expect(fileContents).toBeInstanceOf(Buffer);
            expect(Utf8Encoding.instance.getString(fileContents)).toBe('123abc7890');

            await fileSystem.close(fileDescriptor);
        });
    });


    describe(`#close()`, () => {
        it(`throws if 'fileDescriptor' argument is not defined`, async () => {
            await asyncExpect(async () => {
                await fileSystem.close(undefined);
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'fileDescriptor' argument is null`, async () => {
            await asyncExpect(async () => {
                await fileSystem.close(null);
            }).toThrowError(ArgumentNullException);
        });

        it(`closes opened file by descriptor`, async () => {
            let fileDescriptor: FileDescriptor = await fileSystem.open(fixtures.singleLineTextFile.fileName);

            await fileSystem.close(fileDescriptor);
        });
    });


    describe(`#getStats()`, () => {
        it(`throws if 'fullName' argument is not defined`, async () => {
            await asyncExpect(async () => {
                await fileSystem.getStats(undefined);
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'fullName' argument is null`, async () => {
            await asyncExpect(async () => {
                await fileSystem.getStats(null);
            }).toThrowError(ArgumentNullException);
        });

        it(`creates file with specified access permissions`, async () => {
            let stats: FileSystemEntry = await fileSystem.getStats(fixtures.singleLineTextFile.fileName);

            expect(stats).toBeInstanceOf(Object);
            expect(stats.type).toBe(FileSystemEntryType.File);
            expect(stats.creationTime).toBeInstanceOf(DateTime);
            expect(stats.lastAccessTime).toBeInstanceOf(DateTime);
            expect(stats.lastChangeTime).toBeInstanceOf(DateTime);
            expect(stats.lastWriteTime).toBeInstanceOf(DateTime);
            expect(stats.length).toBeGreaterThan(0);
            expect(typeof stats.inode).toBe('number');
            expect(typeof stats.accessPermissions).toBe('number');
            expect(typeof stats.deviceId).toBe('number');
            expect(typeof stats.specialDeviceId).toBe('number');
        });
    });


    describe(`#getPermissions()`, () => {
        it(`throws if 'fullName' argument is not defined`, async () => {
            await asyncExpect(async () => {
                await fileSystem.getPermissions(undefined);
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'fullName' argument is null`, async () => {
            await asyncExpect(async () => {
                await fileSystem.getPermissions(null);
            }).toThrowError(ArgumentNullException);
        });

        it(`returns access permissions of file / directory`, async () => {
            let permissions: AccessPermissions = await fileSystem.getPermissions(fixtures.singleLineTextFile.fileName);

            expect(typeof permissions).toBe('number');
        });
    });


    describe(`#setPermissions()`, () => {
        it(`throws if 'fullName' argument is not defined`, async () => {
            await asyncExpect(async () => {
                await fileSystem.setPermissions(undefined, AccessPermissions.Default);
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'fullName' argument is null`, async () => {
            await asyncExpect(async () => {
                await fileSystem.setPermissions(null, AccessPermissions.Default);
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'accessPermissions' argument is null`, async () => {
            await asyncExpect(async () => {
                await fileSystem.setPermissions(fixtures.singleLineTextFile.fileName, null);
            }).toThrowError(ArgumentNullException);
        });

        it(`changes access permissions of file / directory`, async () => {
            await fileSystem.setPermissions(fixtures.singleLineTextFile.fileName, AccessPermissions.Default);

            let permissions: AccessPermissions = await fileSystem.getPermissions(fixtures.singleLineTextFile.fileName);

            expect(permissions).toBe(AccessPermissions.Default);
        });
    });


    describe(`#readFile()`, () => {
        it(`throws if 'fileName' argument is not defined`, async () => {
            await asyncExpect(async () => {
                return fileSystem.readFile(undefined);
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'fileName' argument is null`, async () => {
            await asyncExpect(async () => {
                return fileSystem.readFile(null);
            }).toThrowError(ArgumentNullException);
        });

        it(`returns contents of the file as bytes`, async () => {
            let fileName: string = fixtures.singleLineTextFile.fileName;
            let fileContents: Buffer = await fileSystem.readFile(fileName);

            expect(fileContents).toBeInstanceOf(Buffer);
            expect(fileContents.length).toBe(10);
            expect(Utf8Encoding.instance.getString(fileContents)).toBe('1234567890');
        });
    });


    describe(`#writeFile()`, () => {
        it(`throws if 'fileName' argument is not defined`, async () => {
            let fileContents: Buffer = Utf8Encoding.instance.getBytes('abc');

            await asyncExpect(async () => {
                return fileSystem.writeFile(undefined, fileContents);
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'fileName' argument is null`, async () => {
            let fileContents: Buffer = Utf8Encoding.instance.getBytes('abc');

            await asyncExpect(async () => {
                return fileSystem.writeFile(null, fileContents);
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'fileContent' argument is not defined`, async () => {
            let fileName: string = fixtures.singleLineTextFile.fileName;
            let fileContent: Buffer;

            await asyncExpect(async () => {
                return fileSystem.writeFile(fileName, fileContent);
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'fileContent' argument is null`, async () => {
            let fileName: string = fixtures.singleLineTextFile.fileName;
            let fileContent: Buffer = null;

            await asyncExpect(async () => {
                return fileSystem.writeFile(fileName, fileContent);
            }).toThrowError(ArgumentNullException);
        });

        it(`writes content to the file`, async () => {
            let fileName: string = fixtures.singleLineTextFile.fileName;
            let fileContents: Buffer = Utf8Encoding.instance.getBytes('qwerty');

            await fileSystem.writeFile(fileName, fileContents);

            let actualContent: Buffer = await fileSystem.readFile(fileName);

            expect(actualContent).toBeInstanceOf(Buffer);
            expect(actualContent.length).toBe(6);
            expect(Utf8Encoding.instance.getString(actualContent)).toBe('qwerty');
        });
    });


    describe(`#removeFile()`, () => {
        it(`throws if 'fileName' argument is not defined`, async () => {
            await asyncExpect(async () => {
                return fileSystem.removeFile(undefined);
            }).toThrowError(ArgumentNullException);
        });

        it(`throws if 'fileName' argument is null`, async () => {
            await asyncExpect(async () => {
                return fileSystem.removeFile(null);
            }).toThrowError(ArgumentNullException);
        });

        it(`removes file with given name`, async () => {
            let fileName: string = fixtures.singleLineTextFile.fileName;

            expect(await fileSystem.fileExists(fileName)).toBe(true);

            await fileSystem.removeFile(fileName);

            expect(await fileSystem.fileExists(fileName)).toBe(false);
        });
    });
});
