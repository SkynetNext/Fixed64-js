// Fixed64WasmLoader.ts
import MainModuleFactory, { MainModule } from '../../dist/Fixed64Native'

export let Fixed64Module: MainModule;
export let interopParamArrayAddress: number;
export let interopParamUint32ArrayAddress: number;
export let interopReturnArrayAddress: number;
export let interopReturnUint32ArrayAddress: number;
export let sizeOfFixed64Param: number;
export let fixed64ParamOffsets: any;

async function loadWasmFile(): Promise<Uint8Array> {
    if (typeof window !== 'undefined') {
        // Browser environment
        // Fetch the WASM file using the Fetch API, relative to the current location
        const response = await fetch(new URL('../../dist/Fixed64Native.wasm', window.location.href));
        // Convert the response to an ArrayBuffer and then to a Uint8Array
        return new Uint8Array(await response.arrayBuffer());
    } else if (typeof process !== 'undefined') {
        // Node.js environment
        // Use Node.js modules to read the file from the filesystem
        const path = require('path');
        const fs = require('fs').promises; // Use the promises API of the fs module for async operations
        const wasmPath = path.join(__dirname, '../../dist/Fixed64Native.wasm'); // Construct the path to the WASM file
        return fs.readFile(wasmPath); // Read and return the file as a Uint8Array
    }

    // If neither window nor process is defined, the environment is not supported
    throw new Error('Unsupported environment');
}

export async function loadFixed64Wasm(): Promise<MainModule> {
    if (!Fixed64Module) { // Check if the module is already loaded
        const wasmData = await loadWasmFile();

        let module: MainModule;

        module = await initWasm(MainModuleFactory, wasmData);

        Fixed64Module = module; // Store the loaded module for later use.
        interopParamArrayAddress = module.getInteropParamArrayAddress();
        interopParamUint32ArrayAddress = module.getInteropUint32ParamArrayAddress();
        interopReturnArrayAddress = module.getInteropReturnArrayAddress();
        interopReturnUint32ArrayAddress = module.getInteropReturnUint32ArrayAddress();
        sizeOfFixed64Param = module.getSizeOfFixed64Param();
        fixed64ParamOffsets = module.getFixed64ParamOffsets();
    }

    return Fixed64Module;
}

function initWasm(wasmFactory: any, wasmData: Uint8Array): Promise<MainModule> {
    return new Promise<MainModule>((resolve, reject) => {
        const errorMessage = (err: any): string => `[Fixed64]: Fixed64 wasm load failed: ${err}`;

        wasmFactory({
            instantiateWasm(importObject: WebAssembly.Imports, receiveInstance: (instance: WebAssembly.Instance, module: WebAssembly.Module) => void) {
                WebAssembly.instantiate(wasmData, importObject).then((result: any) => {
                    receiveInstance(result.instance, result.module);
                }).catch((err: any) => reject(errorMessage(err)));
            }
        }).then((Instance: any) => {
            return Promise.resolve(Instance)
        }).then(resolve).catch((err: any) => reject(errorMessage(err)));
    });
}