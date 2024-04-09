import { find as findCache, downloadTool, extractTar, extractZip, cacheDir } from '@actions/tool-cache';
import { addPath, exportVariable, getBooleanInput } from '@actions/core';
import { maxSatisfying } from 'semver';
import { existsSync } from 'fs';
import { rename, writeFile } from 'fs/promises';
import { join as pathJoin } from 'path';
import { getVersions } from './utils/scraper';
import { Version } from './structures/versioning';

const CACHE_KEY = 'amxxpawn';
let versions: { [x: string]: Version | { toEndpoint: () => string; }; };

export async function installCompiler(range: string): Promise<string> {
    versions = await getVersions();
    console.dir(versions);

    console.log(`installCompiler(): versions: ${Object.keys(versions)}, range: ${range}`);
    let version = maxSatisfying(Object.keys(versions), range);

    if (version === null) {
        throw new Error(`Unable to find a version matching ${range}`);
    }

    let cache = findCache(CACHE_KEY, version);

    if (!cache) {
        cache = await downloadCompiler(version);
    }

    addPath(cache);
    exportVariable('scriptingPath', pathJoin(cache));
    exportVariable('includePath', pathJoin(cache, 'include'));

    return version;
}

async function downloadCompiler(version: string) {
    const amxxPath = await downloadTool(versions[version].toEndpoint());
    
    let extracted: string;

    if (process.platform === 'linux') {
        extracted = await extractTar(amxxPath);
    } else {
        extracted = await extractZip(amxxPath);
    }

    const amxxRoot = pathJoin(extracted, 'addons', 'amxmodx', 'scripting');

    return await cacheDir(amxxRoot, CACHE_KEY, version);
}