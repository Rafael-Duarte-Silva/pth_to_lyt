import fs from "fs";
import { LYTObject } from "./types";

export function writeLYT(path: string, lfsObjectArray: LYTObject[]) {
    const bufferHeader: Buffer<ArrayBuffer> = buildBufferHeader(
        lfsObjectArray.length,
    );
    const bufferObjects: Buffer<ArrayBuffer> =
        buildBufferLYTObject(lfsObjectArray);
    const bufferList: Buffer<ArrayBuffer>[] = [bufferHeader, bufferObjects];
    const buffer: Buffer<ArrayBuffer> = Buffer.concat(bufferList);

    fs.writeFileSync(path, buffer);
}

function buildBufferHeader(length: number) {
    const buffer: Buffer<ArrayBuffer> = Buffer.alloc(12);

    buffer.write("LFSLYT", 0, "ascii");
    buffer.writeUInt8(0, 6);
    buffer.writeUInt8(252, 7);
    buffer.writeUInt16LE(length, 8);
    buffer.writeUInt8(0, 10);
    buffer.writeUInt8(9, 11);

    return buffer;
}

function buildBufferLYTObject(lfsObjectArray: LYTObject[]) {
    const buffer: Buffer<ArrayBuffer> = Buffer.alloc(8 * lfsObjectArray.length);
    let offset: number = 0;

    for (let i: number = 0; i < lfsObjectArray.length; i++) {
        const object: LYTObject = lfsObjectArray[i];

        buffer.writeInt16LE(object.x, offset);
        offset += 2;
        buffer.writeInt16LE(object.y, offset);
        offset += 2;
        buffer.writeUInt8(object.z, offset);
        offset++;
        buffer.writeUInt8(object.flags, offset);
        offset++;
        buffer.writeUInt8(object.index, offset);
        offset++;
        buffer.writeUInt8(object.heading, offset);
        offset++;
    }

    return buffer;
}
