// WebWasmLoader.ts
export async function loadWasmFileFromWeb(url: string): Promise<Uint8Array> {
    console.log("Loading WASM from URL:", url);
    const response = await fetch(url);
    return new Uint8Array(await response.arrayBuffer());
}