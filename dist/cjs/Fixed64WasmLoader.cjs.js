"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixed64ParamOffsets = exports.sizeOfFixed64Param = exports.interopReturnUint32ArrayAddress = exports.interopReturnArrayAddress = exports.interopParamUint32ArrayAddress = exports.interopParamArrayAddress = exports.Fixed64Module = void 0;
exports.loadFixed64Wasm = loadFixed64Wasm;
// Fixed64WasmLoader.ts
const path_1 = require("path");
const Fixed64Native_js_1 = __importDefault(require("../../dist/cjs/Fixed64Native.js"));
let __dirname = (0, path_1.dirname)(require.main?.filename || '');
async function loadWasmFile() {
    if (typeof window !== 'undefined') {
        console.log("Loading WASM from URL");
        const response = await fetch(new URL('../Fixed64Native.wasm', window.location.href));
        return new Uint8Array(await response.arrayBuffer());
    }
    else if (typeof process !== 'undefined') {
        console.log("Loading WASM from filesystem");
        const fs = (await Promise.resolve().then(() => __importStar(require('fs/promises')))).default;
        if (process.platform === "win32") {
            // https://stackoverflow.com/questions/64132284/in-windows-node-js-path-join-prepends-the-current-working-directorys-drive
            __dirname = __dirname.replace(/^\/([a-zA-Z]:)/, '$1');
        }
        const wasmPath = (0, path_1.join)(__dirname, '../Fixed64Native.wasm');
        return fs.readFile(wasmPath);
    }
    throw new Error('Unsupported environment');
}
async function loadFixed64Wasm() {
    if (!exports.Fixed64Module) {
        const wasmData = await loadWasmFile();
        exports.Fixed64Module = await initWasm(Fixed64Native_js_1.default, wasmData);
        exports.interopParamArrayAddress = exports.Fixed64Module.getInteropParamArrayAddress();
        exports.interopParamUint32ArrayAddress = exports.Fixed64Module.getInteropUint32ParamArrayAddress();
        exports.interopReturnArrayAddress = exports.Fixed64Module.getInteropReturnArrayAddress();
        exports.interopReturnUint32ArrayAddress = exports.Fixed64Module.getInteropReturnUint32ArrayAddress();
        exports.sizeOfFixed64Param = exports.Fixed64Module.getSizeOfFixed64Param();
        exports.fixed64ParamOffsets = exports.Fixed64Module.getFixed64ParamOffsets();
    }
    return exports.Fixed64Module;
}
function initWasm(wasmFactory, wasmData) {
    return new Promise((resolve, reject) => {
        wasmFactory({
            instantiateWasm(importObject, receiveInstance) {
                WebAssembly.instantiate(wasmData, importObject).then((result) => {
                    receiveInstance(result.instance, result.module);
                }).catch(reject);
            }
        }).then(resolve).catch(reject);
    });
}
