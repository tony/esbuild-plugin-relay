"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
function setup(build, opts) {
    const currentCwd = process.cwd();
    let relayConfig;
    try {
        // eslint-disable-next-line no-eval
        process.chdir(build.initialOptions.absWorkingDir);
        relayConfig = eval("require")("relay-config").loadConfig();
        // eslint-disable-next-line lint/no-unused-catch-bindings
    }
    catch (_err) {
    }
    finally {
        process.chdir(currentCwd);
    }
    relayConfig = Object.assign({
        language: "javascript",
        artifactDirectory: "src/__generated__",
    }, relayConfig || {});
    let filter;
    if (relayConfig.extensions && relayConfig.extensions.length) {
        filter = new RegExp(`/\.(${relayConfig.extensions.join("|")})/`);
    }
    else if (relayConfig.language == "typescript") {
        filter = /\.(ts|tsx)/;
    }
    else {
        filter = /\.(js|jsx)/;
    }
    const options = Object.assign({ filter }, opts);
    const compileOptions = Object.assign({
        artifactDirectory: relayConfig.artifactDirectory,
        devMode: process.env.NODE_ENV !== "production",
        module: "esm",
    }, opts);
    return { options, compileOptions };
}
exports.setup = setup;
