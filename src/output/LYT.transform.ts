import { LFS_METER, SCALAR_FACTOR } from "./constants";
import { PTHNode } from "../input/types";
import { DriveLimits, LYTObject } from "./types";
import { Vector2 } from "../shared/types";

// LFS NOTATION
// 0 = world y axis direction

// LYT NOTATION
// 128 : heading of zero
// 192 : heading of 90 degrees
// 0   : heading of 180 degrees
// 64  : heading of -90 degrees

export function transformLYT(
    nodes: PTHNode[],
    numberNodes: number,
): LYTObject[] {
    const ZBYTE: number = 240;
    const CHECKPOINT_INDEX: number = 252;
    const FIRST_CHECKPOINT_FLAG: number = 0x01;
    const MAX_NODE: number = 180;

    const lytObjectArray: LYTObject[] = [];
    const length: number = numberNodes < MAX_NODE ? numberNodes : MAX_NODE;
    const gap: number = numberNodes / length;

    for (let i: number = 0; i < length; i++) {
        const nodeIndex: number = Math.round(gap * i);
        const node: PTHNode = nodes[nodeIndex];

        const heading: number = calculateHeading(node.dir);
        const driveLimits: DriveLimits = calculateDriveLimits(node);
        const halfWidth: number = calculateHalfWidth(driveLimits);
        const midPoint: Vector2 = calculateMidPoint(driveLimits);

        const lytObjectX: number = transformLYTObjectPosition(midPoint.x);
        const lytObjectY: number = transformLYTObjectPosition(midPoint.y);

        lytObjectArray.push({
            x: lytObjectX,
            y: lytObjectY,
            z: ZBYTE,
            flags: (halfWidth << 2) | FIRST_CHECKPOINT_FLAG,
            index: CHECKPOINT_INDEX,
            heading: heading,
        });
    }

    return lytObjectArray;
}

export function transformLYTObjectPosition(value: number): number {
    return Math.round(value / SCALAR_FACTOR);
}

export function calculateHeading(dir: Vector2): number {
    // 0 = world y axis direction
    const ANGLE_OFFSET = 90;

    const angleRadians: number = Math.atan2(dir.y, dir.x);
    const angleDegrees: number = angleRadians * (180 / Math.PI) - ANGLE_OFFSET;

    //"Heading represents 360 degrees in 256 values."
    return Math.round(((angleDegrees + 180) * 256) / 360) & 0xff;
}

export function calculateDriveLimits(node: PTHNode): DriveLimits {
    // "A node is represented by a line perpendicular to its direction."
    // perpendicular = 90 degrees
    // rotate 90 degrees to left for find drive limits direct
    const perpendicularX: number = -node.dir.y;
    const perpendicularY: number = node.dir.x;

    // driveLeft negative
    // driveRight positive
    const left = {
        x: node.centre.x - perpendicularX * node.limits.driveLeft * LFS_METER,
        y: node.centre.y - perpendicularY * node.limits.driveLeft * LFS_METER,
    };

    const right = {
        x: node.centre.x - perpendicularX * node.limits.driveRight * LFS_METER,
        y: node.centre.y - perpendicularY * node.limits.driveRight * LFS_METER,
    };

    return { left, right };
}

export function calculateMidPoint(driveLimits: DriveLimits): Vector2 {
    const x: number = (driveLimits.right.x + driveLimits.left.x) / 2;
    const y: number = (driveLimits.right.y + driveLimits.left.y) / 2;

    return { x, y };
}

export function calculateHalfWidth(
    driveLimits: DriveLimits,
    widthOffset: number = 2,
): number {
    const distanceX: number = Math.pow(
        driveLimits.right.x - driveLimits.left.x,
        2,
    );
    const distanceY: number = Math.pow(
        driveLimits.right.y - driveLimits.left.y,
        2,
    );
    const distance: number = Math.sqrt(distanceX + distanceY);
    const halfWidth: number = Math.round(
        distance / LFS_METER / 2 + widthOffset,
    );

    // "half width in metres (1 to 31 ...)."
    return halfWidth > 31 ? 31 : halfWidth;
}
