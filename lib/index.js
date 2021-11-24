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
const fs = __importStar(require("fs"));
const compile_1 = require("./compile");
const setup_1 = require("./setup");
function createRelayPlugin(opts) {
    return {
        name: "relay",
        setup(build) {
            const { options, compileOptions } = setup_1.setup(build, opts);
            build.onLoad({ filter: options.filter }, async (args) => {
                let contents = await fs.promises.readFile(args.path, "utf8");
                if (contents.includes("graphql`")) {
                    contents = compile_1.compile(args.path, contents, compileOptions);
                }
                return {
                    contents: contents,
                };
            });
        },
    };
}
exports.default = createRelayPlugin;
