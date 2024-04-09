import { find as findCache, downloadTool, extractTar, extractZip, cacheDir } from '@actions/tool-cache';
import { addPath, exportVariable, getBooleanInput } from '@actions/core';
import { maxSatisfying } from 'semver';
import { existsSync } from 'fs';
import { rename, writeFile } from 'fs/promises';
import { join as pathJoin } from 'path';
import { getVersions } from './utils/scraper';
import { Version } from './structures/versioning';

const CACHE_KEY = 'sourcepawn';
let versions: { [x: string]: Version | { toEndpoint: () => string; }; };

export async function installCompiler(range: string): Promise<string> {
    versions = await getVersions();

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
    const spPath = await downloadTool(versions[version].toEndpoint());
    
    let extracted: string;

    if (process.platform === 'linux') {
        extracted = await extractTar(spPath);
    } else {
        extracted = await extractZip(spPath);
    }

    const spRoot = pathJoin(extracted, 'addons', 'sourcemod', 'scripting');

    return await cacheDir(spRoot, CACHE_KEY, version);
}