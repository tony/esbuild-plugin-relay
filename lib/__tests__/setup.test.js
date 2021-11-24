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
const setup_1 = require("../setup");
const path = __importStar(require("path"));
const fixtures = path.join(process.cwd(), "src", "__tests__", "fixtures");
test("use relay-config to automatically detect configuration", () => {
    const { options, compileOptions } = setup_1.setup({
        initialOptions: {
            absWorkingDir: path.join(fixtures, "relay-config-file"),
        },
    }, {});
    expect(options.filter.toString()).toBe("/\\/.(js)\\//");
    expect(compileOptions.artifactDirectory).toBe("src/__graphql__");
});
test("use relay-config to automatically detect TypeScript configuration", () => {
    const { options, compileOptions } = setup_1.setup({
        initialOptions: {
            absWorkingDir: path.join(fixtures, "relay-config-typescript"),
        },
    }, {});
    expect(options.filter.toString()).toBe("/\\.(ts|tsx)/");
    expect(compileOptions.artifactDirectory).toBe("src/__generated__");
});
