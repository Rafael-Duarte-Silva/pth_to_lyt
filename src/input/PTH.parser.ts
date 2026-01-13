import { PTHNode, LocalHeader, PTH, SystemHeader } from "./types";

export function parserPTH(buffer: Buffer<ArrayBuffer>): PTH {
    const systemHeader: SystemHeader = readSystemHeader(buffer);
    const localHeader: LocalHeader = readLocalHeader(buffer);
    const numberNodes: number = readNumberNodes(buffer);
    const mainNodes: PTHNode[] = readMainNodes(buffer, numberNodes);

    return {
        systemHeader,
        localHeader,
        numberNodes,
        mainNodes,
    };
}

function readSystemHeader(buffer: Buffer<ArrayBuffer>): SystemHeader {
    let offset: number = 0;
    const magic: string = buffer.toString("ascii", offset, offset + 6);
    offset += 6;

    if (magic !== "SRPATH") {
        throw new Error("Invalid File (SRPATH not found)");
    }

    const version: number = buffer.readUInt8(offset++);
    const revision: number = buffer.readUInt8(offset++);

    if (version > 0 || revision > 252) {
        throw new Error("Wrong version");
    }

    const flags: number = buffer.readInt32LE(offset);

    return {
        version,
        revision,
        flags,
    };
}

function readLocalHeader(buffer: Buffer<ArrayBuffer>): LocalHeader {
    let offset: number = 12;
    const miniRev: number = buffer.readUInt8(offset++);

    return {
        miniRev,
    };
}

function readNumberNodes(buffer: Buffer<ArrayBuffer>): number {
    let offset: number = 16;
    const numberNodes = buffer.readUInt16LE(offset);
    if (numberNodes <= 0) throw new Error("The number of nodes is too low");

    return numberNodes;
}

function readNode(offset: number, buffer: Buffer<ArrayBuffer>): PTHNode {
    const node: PTHNode = {
        centre: {
            x: buffer.readInt32LE(offset + 4),
            y: buffer.readInt32LE(offset + 8),
        },
        dir: {
            x: buffer.readFloatLE(offset + 16),
            y: buffer.readFloatLE(offset + 20),
        },
        limits: {
            driveLeft: buffer.readFloatLE(offset + 36),
            driveRight: buffer.readFloatLE(offset + 40),
        },
    };
    return node;
}

function readMainNodes(buffer: Buffer<ArrayBuffer>, length: number): PTHNode[] {
    const startOffset: number = 56;
    const nodes: PTHNode[] = [];
    for (let i: number = 0; i < length; i++) {
        const offset: number = startOffset + 44 * i;
        nodes[i] = readNode(offset, buffer);
    }

    return nodes;
}
