// Fixed64WasmLoader.ts
import MainModuleFactory from '../../dist/esm/Fixed64Native.mjs';
export let Fixed64Module;
export let interopParamArrayAddress;
export let interopParamUint32ArrayAddress;
export let interopReturnArrayAddress;
export let interopReturnUint32ArrayAddress;
export let sizeOfFixed64Param;
export let fixed64ParamOffsets;
export async function loadFixed64Wasm(loadWasmFile) {
    if (!Fixed64Module) {
        const wasmData = await loadWasmFile();
        Fixed64Module = await initWasm(MainModuleFactory, wasmData);
        interopParamArrayAddress = Fixed64Module.getInteropParamArrayAddress();
        interopParamUint32ArrayAddress = Fixed64Module.getInteropUint32ParamArrayAddress();
        interopReturnArrayAddress = Fixed64Module.getInteropReturnArrayAddress();
        interopReturnUint32ArrayAddress = Fixed64Module.getInteropReturnUint32ArrayAddress();
        sizeOfFixed64Param = Fixed64Module.getSizeOfFixed64Param();
        fixed64ParamOffsets = Fixed64Module.getFixed64ParamOffsets();
    }
    return Fixed64Module;
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
