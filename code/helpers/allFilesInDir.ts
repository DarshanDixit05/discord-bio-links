import { isAbsolute, resolve } from "path";
import { stat, readdir, access } from "fs/promises";
import { Stats } from "fs";

export type FilterFunction = (subpath: string, index: number, array: string[]) => boolean;
const noFilter: FilterFunction = () => true;

export async function allFilesInDir(dir: string, recursive: boolean, filter?: FilterFunction): Promise<string[]> {
    if (!isAbsolute(dir)) throw new TypeError(`Given path '${dir}' is not absolute!`);
    if (filter === undefined) filter = noFilter;

    const filesWithin: string[] = [];

    const availablePathsWithin: string[] = (await readdir(dir)).map(p => resolve(dir, p));

    for (const subpath of availablePathsWithin) {
        const infos: Stats = await stat(subpath);

        if (infos.isDirectory()) {
            if (recursive) filesWithin.push(...(await allFilesInDir(subpath, recursive, filter)));
        } else filesWithin.push(subpath);
    }

    return filesWithin.filter(filter);
}