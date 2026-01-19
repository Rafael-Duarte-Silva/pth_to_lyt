import { Vector2 } from "../shared/types";

export type PTH = {
    systemHeader: SystemHeader;
    localHeader: LocalHeader;
    numberNodes: number;
    mainNodes: PTHNode[];
};

export type SystemHeader = {
    version: number;
    revision: number;
    flags: number;
};

export type LocalHeader = {
    miniRev: number;
};

export type PTHNode = {
    centre: Vector2;
    dir: Vector2;
    limits: {
        driveLeft: number;
        driveRight: number;
    };
};
