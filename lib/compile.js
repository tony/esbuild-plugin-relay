"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = void 0;
const graphql_1 = require("graphql");
const crypto = __importStar(require("crypto"));
const path = __importStar(require("path"));
const defaultOptions = {
    condition: "",
    devMode: false,
    module: "esm",
    suffix: "",
    buildCommand: "relay-compiler",
};
function compile(file, contents, opts) {
    opts = Object.assign({}, defaultOptions, opts);
    const imports = [];
    contents = contents.replace(/graphql`([\s\S]*?)`/gm, (_match, query) => {
        const ast = graphql_1.parse(query);
        if (ast.definitions.length === 0) {
            throw new Error("Unexpected empty graphql tag.");
        }
        const definition = ast.definitions[0];
        if (definition.kind !== "FragmentDefinition" &&
            definition.kind !== "OperationDefinition") {
            throw new Error("Expected a fragment, mutation, query, or " +
                "subscription, got `" +
                definition.kind +
                "`.");
        }
        const name = definition.name && definition.name.value;
        if (!name) {
            throw new Error("GraphQL operations and fragments must contain names");
        }
        const hash = crypto
            .createHash("md5")
            .update(graphql_1.print(definition), "utf8")
            .digest("hex");
        const id = `graphql__${hash}`;
        const importFile = `${name}.graphql${opts.suffix}`;
        const importPath = getRelativeImportPath(file, opts.artifactDirectory, importFile);
        let result = id;
        if (opts.module === "esm") {
            imports.push(`import ${id} from "${importPath}";`);
        }
        else {
            result = `require("${importPath}")`;
        }
        if (opts.devMode) {
            const error = getErrorMessage(name, opts.buildCommand);
            const condition = opts.condition ? `${opts.condition} && ` : "";
            if (opts.module === "cjs") {
                result =
                    `${id} !== void 0 ? ${id} : (${id} = ${result}, ${condition}${id}.hash && ` +
                        `${id}.hash !== "${hash}" && console.error("${error}"), ${id})`;
            }
            else if (opts.module == "esm") {
                result =
                    `(${condition}${id}.hash && ${id}.hash !== "${hash}" && ` +
                        `console.error("${error}"), ${id})`;
            }
        }
        return result;
    });
    return (imports.length > 0 ? `${imports.join("\n")}\n` : "") + contents;
}
exports.compile = compile;
function getErrorMessage(name, buildCommand) {
    return (`The definition of '${name}' appears to have changed. Run \`${buildCommand}\` to ` +
        `update the generated files to receive the expected data.`);
}
function getRelativeImportPath(fileName, artifactDirectory, fileToRequire) {
    const relative = path.relative(path.dirname(fileName), path.resolve(artifactDirectory));
    const relativeReference = relative.length === 0 || !relative.startsWith(".") ? "./" : "";
    return relativeReference + path.join(relative, fileToRequire);
}
