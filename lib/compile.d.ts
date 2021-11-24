export interface CompileOptions {
    artifactDirectory: string;
    condition?: string;
    devMode?: boolean;
    module?: "cjs" | "esm";
    suffix?: string;
    buildCommand?: string;
}
export declare function compile(file: string, contents: string, opts: CompileOptions): string;
