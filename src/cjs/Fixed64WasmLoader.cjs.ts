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
        Fixed64Module = await MainModuleFactory({ wasmBinary: wasmData });
        interopParamArrayAddress = Fixed64Module.getInteropParamArrayAddress();
        interopParamUint32ArrayAddress = Fixed64Module.getInteropUint32ParamArrayAddress();
        interopReturnArrayAddress = Fixed64Module.getInteropReturnArrayAddress();
        interopReturnUint32ArrayAddress = Fixed64Module.getInteropReturnUint32ArrayAddress();
        sizeOfFixed64Param = Fixed64Module.getSizeOfFixed64Param();
        fixed64ParamOffsets = Fixed64Module.getFixed64ParamOffsets();
    }
    return Fixed64Module;
}