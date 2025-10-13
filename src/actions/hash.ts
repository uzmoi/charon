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

export const hashAction = defineAction({
  name: "Hash",
  input: {
    algorithm: t.string("SHA-256", [
      "SHA-1",
      "SHA-224",
      "SHA-256",
      "SHA-384",
      "SHA-512",
      "SHA-512/224",
      "SHA-512/256",
    ]),
    data: t.bytes(),
  },
  output: { hash: t.bytes() },
  async action({ algorithm, data }): Promise<{ hash: ArrayBuffer }> {
    switch (algorithm) {
      case "SHA-1":
      case "SHA-224":
      case "SHA-256":
      case "SHA-384":
      case "SHA-512":
      case "SHA-512/224":
      case "SHA-512/256": {
        return { hash: await sha1or2(algorithm, data) };
      }
      default: {
        throw new Error("Unknown algorithm");
      }
    }
  },
});
