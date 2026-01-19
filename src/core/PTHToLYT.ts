import { parserPTH } from "../input/PTH.parser";
import { readPTH } from "../input/PTH.reader";
import { PTH } from "../input/types";
import { transformLYT } from "../output/LYT.transform";
import { buildLYTBuffer, writeLYT } from "../output/LYT.writer";
import { LYTObject } from "../output/types";

export function convertPTHtoLYT(
    pthFolderPath: string,
    lytFolderPath: string,
    trackPrefix: string,
    lytName: string,
    options: { returnBuffer: true },
): Buffer<ArrayBuffer>;

export function convertPTHtoLYT(
    pthFolderPath: string,
    lytFolderPath: string,
    trackPrefix: string,
    lytName: string,
    options?: { returnBuffer?: false },
): void;

/** Generate a .lyt file */
export function convertPTHtoLYT(
    pthFolderPath: string,
    lytFolderPath: string,
    trackPrefix: string,
    lytName: string,
    options?: { returnBuffer?: boolean },
): Buffer<ArrayBuffer> | void {
    const pthPath: string = `${pthFolderPath}/${trackPrefix}.pth`;
    const lytPath: string = `${lytFolderPath}/${trackPrefix}_${lytName}.lyt`;

    const raw: Buffer<ArrayBuffer> = readPTH(pthPath);
    const data: PTH = parserPTH(raw);
    const lytObjectArray: LYTObject[] = transformLYT(
        data.mainNodes,
        data.numberNodes,
    );

    if (options?.returnBuffer) return buildLYTBuffer(lytObjectArray);

    writeLYT(lytPath, lytObjectArray);
}
