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
    const SYSTEM_HEADER_OFFSET: number = 0;

    let offset: number = SYSTEM_HEADER_OFFSET;
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
    const LOCAL_HEADER_OFFSET: number = 12;

    const miniRev: number = buffer.readUInt8(LOCAL_HEADER_OFFSET);

    return {
        miniRev,
    };
}

function readNumberNodes(buffer: Buffer<ArrayBuffer>): number {
    const NUMBER_NODES_OFFSET: number = 16;

    const numberNodes = buffer.readUInt16LE(NUMBER_NODES_OFFSET);
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
    const MAIN_NODES_OFFSET: number = 56;
    const PTH_NODE_OFFSET: number = 44;

    const nodes: PTHNode[] = [];
    for (let i: number = 0; i < length; i++) {
        const offset: number = MAIN_NODES_OFFSET + PTH_NODE_OFFSET * i;
        nodes[i] = readNode(offset, buffer);
    }

    return nodes;
}
