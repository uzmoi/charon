import { Zstd } from "@hpcc-js/wasm-zstd";
import * as brotli from "brotli-wasm";
import { defineAction } from "./helpers";
import { t } from "./type";

const pipeStream = async (
  data: ArrayBuffer,
  writable: WritableStream<BufferSource>,
  readable: ReadableStream<Uint8Array<ArrayBuffer>>,
): Promise<ArrayBuffer> => {
  {
    const writer = writable.getWriter();
    await writer.write(data);
    await writer.close();
  }

  return new Response(readable).arrayBuffer();
};

const deflate = async (
  data: ArrayBuffer,
  format: CompressionFormat,
): Promise<ArrayBuffer> => {
  const { writable, readable } = new CompressionStream(format);
  return pipeStream(data, writable, readable);
};

const inflate = async (
  data: ArrayBuffer,
  format: CompressionFormat,
): Promise<ArrayBuffer> => {
  const { writable, readable } = new DecompressionStream(format);
  return pipeStream(data, writable, readable);
};

const algorithm = t.string("zstd", [
  "zstd",
  "deflate/raw",
  "deflate/zlib",
  "deflate/gzip",
  "brotli",
]);

export const compressAction = defineAction({
  name: "Compress",
  input: { algorithm, data: t.bytes() },
  output: { data: t.bytes() },
  async action({ algorithm, data }) {
    switch (algorithm) {
      case "zstd": {
        const zstd = await Zstd.load();
        return {
          data: zstd.compress(new Uint8Array(data)).buffer as ArrayBuffer,
        };
      }
      case "deflate/raw": {
        return { data: await deflate(data, "deflate-raw") };
      }
      case "deflate/zlib": {
        return { data: await deflate(data, "deflate") };
      }
      case "deflate/gzip": {
        return { data: await deflate(data, "gzip") };
      }
      case "brotli": {
        return {
          data: brotli.compress(new Uint8Array(data)).buffer as ArrayBuffer,
        };
      }
      default: {
        throw new Error("Unknown algorithm");
      }
    }
  },
});

export const decompressAction = defineAction({
  name: "Decompress",
  input: { algorithm, data: t.bytes() },
  output: { data: t.bytes() },
  async action({ algorithm, data }) {
    switch (algorithm) {
      case "zstd": {
        const zstd = await Zstd.load();
        return {
          data: zstd.decompress(new Uint8Array(data)).buffer as ArrayBuffer,
        };
      }
      case "deflate/raw": {
        return { data: await inflate(data, "deflate-raw") };
      }
      case "deflate/zlib": {
        return { data: await inflate(data, "deflate") };
      }
      case "deflate/gzip": {
        return { data: await inflate(data, "gzip") };
      }
      case "brotli": {
        return {
          data: brotli.decompress(new Uint8Array(data)).buffer as ArrayBuffer,
        };
      }
      default: {
        throw new Error("Unknown algorithm");
      }
    }
  },
});
