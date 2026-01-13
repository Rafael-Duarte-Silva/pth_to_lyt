import fs from "fs";

export function readPTH(path: string): Buffer<ArrayBuffer> {
    const buffer: Buffer<ArrayBuffer> = fs.readFileSync(path);
    if (buffer === undefined) {
        throw new Error("Invalid File");
    }

    return buffer;
}
