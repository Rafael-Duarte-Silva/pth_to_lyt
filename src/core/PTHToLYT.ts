import { parserPTH } from "../input/PTH.parser";
import { readPTH } from "../input/PTH.reader";
import { PTH } from "../input/types";
import { transformLYT } from "../output/LYT.transform";
import { writeLYT } from "../output/LYT.writer";
import { LYTObject } from "../output/types";

/** Generate a .lyt file */
export function convertPTHtoLYT(
    pthFolderPath: string,
    lytFolderPath: string,
    trackPrefix: string,
    lytName: string,
) {
    const pthPath: string = `${pthFolderPath}/${trackPrefix}.pth`;
    const lytPath: string = `${lytFolderPath}/${trackPrefix}_${lytName}.lyt`;

    const raw: Buffer<ArrayBuffer> = readPTH(pthPath);
    const data: PTH = parserPTH(raw);
    const objectArray: LYTObject[] = transformLYT(
        data.mainNodes,
        data.numberNodes,
    );
    writeLYT(lytPath, objectArray);
}
