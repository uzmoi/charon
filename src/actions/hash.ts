import {
  createBLAKE2b,
  createBLAKE2s,
  createBLAKE3,
  createKeccak,
  createMD5,
  createSHA3,
  createXXHash128,
  createXXHash3,
  createXXHash32,
  createXXHash64,
  type IHasher,
} from "hash-wasm";
import { defineAction } from "./helpers";
import { t } from "./type";

type SubtleCryptoAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

const jsSubtleCryptoDigest = (
  algorithm: SubtleCryptoAlgorithm,
  bytes: ArrayBuffer,
) => crypto.subtle.digest(algorithm, bytes);

const sha1or2 = async (
  algorithm: SubtleCryptoAlgorithm | "SHA-224" | "SHA-512/224" | "SHA-512/256",
  bytes: ArrayBuffer,
) => {
  switch (algorithm) {
    case "SHA-224": {
      const sha256Digest = await jsSubtleCryptoDigest("SHA-256", bytes);
      return sha256Digest.slice(0, 224 / 8);
    }
    case "SHA-512/224": {
      const sha512Digest = await jsSubtleCryptoDigest("SHA-512", bytes);
      return sha512Digest.slice(0, 224 / 8);
    }
    case "SHA-512/256": {
      const sha512Digest = await jsSubtleCryptoDigest("SHA-512", bytes);
      return sha512Digest.slice(0, 256 / 8);
    }
    default: {
      return jsSubtleCryptoDigest(algorithm, bytes);
    }
  }
};

const hashWasm = (hasher: IHasher, data: ArrayBuffer) => {
  const digest = hasher.update(data).digest("binary");
  return digest.buffer as ArrayBuffer;
};

const md5 = async (data: ArrayBuffer) => {
  const hasher = await createMD5();
  return hashWasm(hasher, data);
};

const sha3 = async (data: ArrayBuffer, bitLength: 224 | 256 | 384 | 512) => {
  const hasher = await createSHA3(bitLength);
  return hashWasm(hasher, data);
};

const keccak = async (data: ArrayBuffer, bitLength: 224 | 256 | 384 | 512) => {
  const hasher = await createKeccak(bitLength);
  return hashWasm(hasher, data);
};

const blake2s = async (data: ArrayBuffer) => {
  const hasher = await createBLAKE2s();
  return hashWasm(hasher, data);
};

const blake2b = async (data: ArrayBuffer) => {
  const hasher = await createBLAKE2b();
  return hashWasm(hasher, data);
};

const blake3 = async (data: ArrayBuffer) => {
  const hasher = await createBLAKE3();
  return hashWasm(hasher, data);
};

const xxHash32 = async (data: ArrayBuffer) => {
  const hasher = await createXXHash32();
  return hashWasm(hasher, data);
};

const xxHash64 = async (data: ArrayBuffer) => {
  const hasher = await createXXHash64();
  return hashWasm(hasher, data);
};

const xxHash3 = async (data: ArrayBuffer) => {
  const hasher = await createXXHash3();
  return hashWasm(hasher, data);
};

const xxHash128 = async (data: ArrayBuffer) => {
  const hasher = await createXXHash128();
  return hashWasm(hasher, data);
};

export const hashAction = defineAction({
  name: "Hash",
  input: {
    algorithm: t.string("SHA-256", [
      "MD5",
      "SHA-1",
      "SHA-224",
      "SHA-256",
      "SHA-384",
      "SHA-512",
      "SHA-512/224",
      "SHA-512/256",
      "SHA3-224",
      "SHA3-256",
      "SHA3-384",
      "SHA3-512",
      "Keccak-224",
      "Keccak-256",
      "Keccak-384",
      "Keccak-512",
      "BLAKE2s",
      "BLAKE2b",
      "BLAKE3",
      "xxHash32",
      "xxHash64",
      "xxHash3",
      "xxHash128",
    ]),
    data: t.bytes(),
  },
  output: { hash: t.bytes() },
  async action({ algorithm, data }): Promise<{ hash: ArrayBuffer }> {
    switch (algorithm) {
      case "MD5": {
        return { hash: await md5(data) };
      }
      case "SHA-1":
      case "SHA-224":
      case "SHA-256":
      case "SHA-384":
      case "SHA-512":
      case "SHA-512/224":
      case "SHA-512/256": {
        return { hash: await sha1or2(algorithm, data) };
      }
      case "SHA3-224": {
        return { hash: await sha3(data, 224) };
      }
      case "SHA3-256": {
        return { hash: await sha3(data, 256) };
      }
      case "SHA3-384": {
        return { hash: await sha3(data, 384) };
      }
      case "SHA3-512": {
        return { hash: await sha3(data, 512) };
      }
      case "Keccak-224": {
        return { hash: await keccak(data, 224) };
      }
      case "Keccak-256": {
        return { hash: await keccak(data, 256) };
      }
      case "Keccak-384": {
        return { hash: await keccak(data, 384) };
      }
      case "Keccak-512": {
        return { hash: await keccak(data, 512) };
      }
      case "BLAKE2s": {
        return { hash: await blake2s(data) };
      }
      case "BLAKE2b": {
        return { hash: await blake2b(data) };
      }
      case "BLAKE3": {
        return { hash: await blake3(data) };
      }
      case "xxHash32": {
        return { hash: await xxHash32(data) };
      }
      case "xxHash64": {
        return { hash: await xxHash64(data) };
      }
      case "xxHash3": {
        return { hash: await xxHash3(data) };
      }
      case "xxHash128": {
        return { hash: await xxHash128(data) };
      }
      default: {
        throw new Error("Unknown algorithm");
      }
    }
  },
});
