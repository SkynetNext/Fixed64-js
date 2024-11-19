// Fixed64WasmLoader.ts
import { join } from 'path';
import * as fs from 'fs/promises'; // Standard ES module import
import MainModuleFactory from '../../dist/cjs/Fixed64Native.js';

export let Fixed64Module: any;
export let interopParamArrayAddress: number;
export let interopParamUint32ArrayAddress: number;
export let interopReturnArrayAddress: number;
export let interopReturnUint32ArrayAddress: number;
export let sizeOfFixed64Param: number;
export let fixed64ParamOffsets: any;

async function loadWasmFile(): Promise<Uint8Array> {
    if (typeof window !== 'undefined') {
        console.log("Loading WASM from URL");
        const response = await fetch(new URL('./Fixed64Native.wasm', window.location.href));
        return new Uint8Array(await response.arrayBuffer());
    } else if (typeof process !== 'undefined') {
        console.log("Loading WASM from filesystem");
        if (process.platform === "win32") {
            // https://stackoverflow.com/questions/64132284/in-windows-node-js-path-join-prepends-the-current-working-directorys-drive
            __dirname = __dirname.replace(/^\/([a-zA-Z]:)/, '$1');
        }
        const wasmPath = join(__dirname, './Fixed64Native.wasm');

        return fs.readFile(wasmPath);
    }
    throw new Error('Unsupported environment');
}

export async function loadFixed64Wasm(): Promise<any> {
    if (!Fixed64Module) {
        const wasmData = await loadWasmFile();
        const ModuleFactory = await MainModuleFactory();
        Fixed64Module = await initWasm(ModuleFactory, wasmData);
        interopParamArrayAddress = Fixed64Module._getInteropParamArrayAddress();
        interopParamUint32ArrayAddress = Fixed64Module._getInteropUint32ParamArrayAddress();
        interopReturnArrayAddress = Fixed64Module._getInteropReturnArrayAddress();
        interopReturnUint32ArrayAddress = Fixed64Module._getInteropReturnUint32ArrayAddress();
        sizeOfFixed64Param = Fixed64Module._getSizeOfFixed64Param();
        fixed64ParamOffsets = Fixed64Module._getFixed64ParamOffsets();
    }
    return Fixed64Module;
}

async function initWasm(Module: any, wasmData: Uint8Array): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        Module({
            wasmBinary: wasmData,
            onRuntimeInitialized: function () {
                resolve(this);
            }
        });
    });
}
