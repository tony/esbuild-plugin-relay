import type { PluginBuild } from "esbuild";
import { CompileOptions } from "./compile";
export interface PluginOptions {
    artifactDirectory?: string;
    buildCommand?: string;
    condition?: string;
    devMode?: boolean;
    filter?: RegExp;
    module?: "cjs" | "esm";
    suffix?: string;
}
export declare function setup(build: PluginBuild, opts: PluginOptions): {
    options: Required<PluginOptions>;
    compileOptions: CompileOptions;
};
