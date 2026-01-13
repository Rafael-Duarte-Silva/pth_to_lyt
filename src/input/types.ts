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
    centre: {
        x: number;
        y: number;
    };
    dir: {
        x: number;
        y: number;
    };
    limits: {
        driveLeft: number;
        driveRight: number;
    };
};
