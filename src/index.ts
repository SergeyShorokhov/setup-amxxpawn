import * as core from '@actions/core';
import { installCompiler } from './installer';

async function run() {
    try {
        const range = core.getInput('version', { required: true });

        let version = await installCompiler(range);
        core.setOutput('version', version);

    } catch (error: any) {
        core.setFailed(error.message);
    }
}

run();
