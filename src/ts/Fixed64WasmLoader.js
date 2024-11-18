"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFixed64Wasm = exports.fixed64ParamOffsets = exports.sizeOfFixed64Param = exports.interopReturnUint32ArrayAddress = exports.interopReturnArrayAddress = exports.interopParamUint32ArrayAddress = exports.interopParamArrayAddress = exports.Fixed64Module = void 0;
// Fixed64WasmLoader.ts
var Fixed64Native_1 = require("../../dist/Fixed64Native");
function loadWasmFile() {
    return __awaiter(this, void 0, void 0, function () {
        var response, _a, path, fs, wasmPath;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(typeof window !== 'undefined')) return [3 /*break*/, 3];
                    return [4 /*yield*/, fetch(new URL('../../dist/Fixed64Native.wasm', window.location.href))];
                case 1:
                    response = _b.sent();
                    _a = Uint8Array.bind;
                    return [4 /*yield*/, response.arrayBuffer()];
                case 2: 
                // Convert the response to an ArrayBuffer and then to a Uint8Array
                return [2 /*return*/, new (_a.apply(Uint8Array, [void 0, _b.sent()]))()];
                case 3:
                    if (typeof process !== 'undefined') {
                        path = require('path');
                        fs = require('fs').promises;
                        wasmPath = path.join(__dirname, '../../dist/Fixed64Native.wasm');
                        return [2 /*return*/, fs.readFile(wasmPath)]; // Read and return the file as a Uint8Array
                    }
                    _b.label = 4;
                case 4: 
                // If neither window nor process is defined, the environment is not supported
                throw new Error('Unsupported environment');
            }
        });
    });
}
function loadFixed64Wasm() {
    return __awaiter(this, void 0, void 0, function () {
        var wasmData, module_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!exports.Fixed64Module) return [3 /*break*/, 3];
                    return [4 /*yield*/, loadWasmFile()];
                case 1:
                    wasmData = _a.sent();
                    return [4 /*yield*/, initWasm(Fixed64Native_1.default, wasmData)];
                case 2:
                    module_1 = _a.sent();
                    exports.Fixed64Module = module_1; // Store the loaded module for later use.
                    exports.interopParamArrayAddress = module_1.getInteropParamArrayAddress();
                    exports.interopParamUint32ArrayAddress = module_1.getInteropUint32ParamArrayAddress();
                    exports.interopReturnArrayAddress = module_1.getInteropReturnArrayAddress();
                    exports.interopReturnUint32ArrayAddress = module_1.getInteropReturnUint32ArrayAddress();
                    exports.sizeOfFixed64Param = module_1.getSizeOfFixed64Param();
                    exports.fixed64ParamOffsets = module_1.getFixed64ParamOffsets();
                    _a.label = 3;
                case 3: return [2 /*return*/, exports.Fixed64Module];
            }
        });
    });
}
exports.loadFixed64Wasm = loadFixed64Wasm;
function initWasm(wasmFactory, wasmData) {
    return new Promise(function (resolve, reject) {
        var errorMessage = function (err) { return "[Fixed64]: Fixed64 wasm load failed: ".concat(err); };
        wasmFactory({
            instantiateWasm: function (importObject, receiveInstance) {
                WebAssembly.instantiate(wasmData, importObject).then(function (result) {
                    receiveInstance(result.instance, result.module);
                }).catch(function (err) { return reject(errorMessage(err)); });
            }
        }).then(function (Instance) {
            return Promise.resolve(Instance);
        }).then(resolve).catch(function (err) { return reject(errorMessage(err)); });
    });
}
