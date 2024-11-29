"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixed64ParamOffsets = exports.sizeOfFixed64Param = exports.interopReturnUint32ArrayAddress = exports.interopReturnArrayAddress = exports.interopParamUint32ArrayAddress = exports.interopParamArrayAddress = exports.Fixed64Module = void 0;
exports.loadFixed64Wasm = loadFixed64Wasm;
// Fixed64WasmLoader.ts
const Fixed64Native_js_1 = __importDefault(require("../../dist/cjs/Fixed64Native.js"));
async function loadFixed64Wasm(loadWasmFile) {
    if (!exports.Fixed64Module) {
        const wasmData = await loadWasmFile();
        exports.Fixed64Module = await (0, Fixed64Native_js_1.default)({ wasmBinary: wasmData });
        exports.interopParamArrayAddress = exports.Fixed64Module.getInteropParamArrayAddress();
        exports.interopParamUint32ArrayAddress = exports.Fixed64Module.getInteropUint32ParamArrayAddress();
        exports.interopReturnArrayAddress = exports.Fixed64Module.getInteropReturnArrayAddress();
        exports.interopReturnUint32ArrayAddress = exports.Fixed64Module.getInteropReturnUint32ArrayAddress();
        exports.sizeOfFixed64Param = exports.Fixed64Module.getSizeOfFixed64Param();
        exports.fixed64ParamOffsets = exports.Fixed64Module.getFixed64ParamOffsets();
    }
    return exports.Fixed64Module;
}
