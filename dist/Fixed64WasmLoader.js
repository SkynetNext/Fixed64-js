// Fixed64WasmLoader.ts
import MainModuleFactory from '../../dist/Fixed64Native';
export let Fixed64Module;
export let interopParamArrayAddress;
export let interopParamUint32ArrayAddress;
export let interopReturnArrayAddress;
export let interopReturnUint32ArrayAddress;
export let sizeOfFixed64Param;
export let fixed64ParamOffsets;
async function loadWasmFile() {
    if (typeof window !== 'undefined') {
        // Browser environment
        // Fetch the WASM file using the Fetch API, relative to the current location
        const response = await fetch(new URL('../../dist/Fixed64Native.wasm', window.location.href));
        // Convert the response to an ArrayBuffer and then to a Uint8Array
        return new Uint8Array(await response.arrayBuffer());
    }
    else if (typeof process !== 'undefined') {
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
export async function loadFixed64Wasm() {
    if (!Fixed64Module) { // Check if the module is already loaded
        const wasmData = await loadWasmFile();
        console.log("WASM Data Loaded:", wasmData);
        let module;
        console.log(typeof MainModuleFactory); // Should output 'function'
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
function initWasm(wasmFactory, wasmData) {
    return new Promise((resolve, reject) => {
        wasmFactory({
            instantiateWasm(importObject, receiveInstance) {
                WebAssembly.instantiate(wasmData, importObject).then((result) => {
                    receiveInstance(result.instance, result.module);
                }).catch((err) => reject(err));
            }
        }).then((Instance) => {
            return Promise.resolve(Instance);
        }).then(resolve).catch((err) => reject(err));
    });
}
