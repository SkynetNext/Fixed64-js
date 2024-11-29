// Fixed64WasmLoader.ts
import MainModuleFactory from '../../dist/esm/Fixed64Native.js';

export let Fixed64Module: any;
export let interopParamArrayAddress: number;
export let interopParamUint32ArrayAddress: number;
export let interopReturnArrayAddress: number;
export let interopReturnUint32ArrayAddress: number;
export let sizeOfFixed64Param: number;
export let fixed64ParamOffsets: any;

type LoadWasmFileFunction = () => Promise<Uint8Array>;
export async function loadFixed64Wasm(loadWasmFile: LoadWasmFileFunction): Promise<any> {
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

function initWasm(wasmFactory: any, wasmData: Uint8Array): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        wasmFactory({
            instantiateWasm(importObject: WebAssembly.Imports, receiveInstance: (instance: WebAssembly.Instance, module: WebAssembly.Module) => void) {
                WebAssembly.instantiate(wasmData, importObject).then((result: any) => {
                    receiveInstance(result.instance, result.module);
                }).catch(reject);
            }
        }).then(resolve).catch(reject);
    });
}
