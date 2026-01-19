import fs from "fs";
import { LYTObject } from "./types";

export function writeLYT(path: string, lytObjectArray: LYTObject[]) {
    const bufferHeader: Buffer<ArrayBuffer> = buildBufferHeader(
        lytObjectArray.length,
    );
    const bufferObjects: Buffer<ArrayBuffer> =
        buildBufferLYTObject(lytObjectArray);
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

function buildBufferLYTObject(lytObjectArray: LYTObject[]) {
    const buffer: Buffer<ArrayBuffer> = Buffer.alloc(8 * lytObjectArray.length);
    let offset: number = 0;

    for (let i: number = 0; i < lytObjectArray.length; i++) {
        const object: LYTObject = lytObjectArray[i];

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
