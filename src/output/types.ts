export type LYTObject = {
    x: number;
    y: number;
    z: number;
    flags: number;
    index: number;
    heading: number;
};

export type Vector2 = {
    x: number;
    y: number;
};

export type DriveLimits = {
    right: Vector2;
    left: Vector2;
};
