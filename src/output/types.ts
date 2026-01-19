import { Vector2 } from "../shared/types";

export type LYTObject = {
    x: number;
    y: number;
    z: number;
    flags: number;
    index: number;
    heading: number;
};

export type DriveLimits = {
    right: Vector2;
    left: Vector2;
};
