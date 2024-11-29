// NodeWasmLoader.ts
import { join } from 'path';
import * as fs from 'fs/promises'; // Standard ES module import

export async function loadWasmFileFromNode(relativePath: string): Promise<Uint8Array> {
    console.log("Loading WASM from filesystem");
    if (process.platform === "win32") {
        // https://stackoverflow.com/questions/64132284/in-windows-node-js-path-join-prepends-the-current-working-directorys-drive
        __dirname = __dirname.replace(/^\/([a-zA-Z]:)/, '$1');
    }
    const wasmPath = join(__dirname, relativePath);
    return fs.readFile(wasmPath);
}