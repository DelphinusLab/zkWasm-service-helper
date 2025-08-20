import BN from "bn.js";
import { ZkWasmUtil } from "../dist/mjs/helper/util";

// Helper Data for testing
const MAXU64 = BigInt(2) ** BigInt(64) - BigInt(1);
const MAXU256 = BigInt(2) ** BigInt(256) - BigInt(1);
const MAXU64_BN = new BN(MAXU64.toString());
const MAXU256_BN = new BN(MAXU256.toString());

describe("ZkWasmUtil", () => {
  describe("bytesToBN", () => {
    it("should convert a Uint8Array to an array of BN objects", () => {
      const byteArray = [1, 2, 3, 4, 5, 6, 7, 8];
      const bytes = new Uint8Array(byteArray);
      const expected = [new BN(byteArray, "le")];

      const result = ZkWasmUtil.bytesToBN(bytes);

      expect(result).toEqual(expected);
    });

    it("should convert a Uint8Array to an array of BN objects with chunksize", () => {
      const chunkSize = 4;
      const byteArray = [1, 2, 3, 4, 5, 6, 7, 8];
      const bytes = new Uint8Array(byteArray);
      const expected = [new BN([1, 2, 3, 4], "le"), new BN([5, 6, 7, 8], "le")];

      const result = ZkWasmUtil.bytesToBN(bytes, chunkSize);

      expect(result).toEqual(expected);
    });
  });

  describe("BNToHexString", () => {
    it("should convert a BN object to a hex string", () => {
      const bn = MAXU64_BN;
      const expected = "0x" + MAXU64_BN.toString("hex");

      const result = ZkWasmUtil.bnToHexString(bn);

      expect(result).toEqual(expected);
    });
  });

  describe("BNToBytes", () => {
    it("should convert a BN object to a Uint8Array", () => {
      const bn = MAXU64_BN;
      const chunkSize = 8;
      const expected = new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255]);

      const result = ZkWasmUtil.bnToBytes(bn, chunkSize);

      expect(result).toEqual(expected);
    });

    it("should throw an error if BN is larger than chunksize", () => {
      const bn = MAXU256_BN;
      const chunkSize = 4;

      expect(() => {
        ZkWasmUtil.bnToBytes(bn, chunkSize);
      }).toThrow();
    });
  });

  describe("BytesToHexStrings", () => {
    it("should convert a single u64 into an array length of 1 with 1 hex string", () => {
      const chunkSize = 8;

      const maxU64bytes = ZkWasmUtil.bnToBytes(MAXU64_BN, chunkSize);

      // hex string as little endian
      const expected = [ZkWasmUtil.bnToHexString(MAXU64_BN)];

      const result = ZkWasmUtil.bytesToHexStrings(maxU64bytes, chunkSize);

      expect(result).toEqual(expected);
    });

    it("should convert multiple U256s to an array of hex strings", () => {
      // 10 U256s as hex strings
      const expected: string[] = [];
      for (let i = 0; i < 10; i++) {
        expected.push(ZkWasmUtil.bnToHexString(MAXU256_BN));
      }

      // 32 bytes per U256
      const chunkSize = 32;

      const U256_Array: BN[] = [];

      for (let i = 0; i < 10; i++) {
        U256_Array.push(MAXU256_BN);
      }

      // flatten the array of U256s into a single Uint8Array
      const data = new Uint8Array(10 * chunkSize);
      for (let i = 0; i < 10; i++) {
        const U256Bytes = ZkWasmUtil.bnToBytes(U256_Array[i], chunkSize);
        data.set(U256Bytes, i * chunkSize);
      }

      const output: string[] = ZkWasmUtil.bytesToHexStrings(data, chunkSize);

      expect(output).toEqual(expected);
    });
  });

  describe("HexStringToBN", () => {
    it("should convert a hex string to a BN object", () => {
      const hexString = "0x0123456789abcdef";
      const chunksize = 8;
      const expected = new BN("0123456789abcdef", "hex");

      const result = ZkWasmUtil.hexStringToBN(hexString);

      expect(result).toEqual(expected);
    });

    it("should throw an error for invalid hex string", () => {
      const hexString = "invalid";
      const chunksize = 8;

      expect(() => {
        ZkWasmUtil.hexStringToBN(hexString);
      }).toThrow();
    });
  });

  describe("HexStringsToBytes", () => {
    it("should convert an array of hex strings to a Uint8Array", () => {
      const hexStrings = ["0x0123456789abcdef", "0x0123456789abcdef"];
      const chunksize = 8;
      const expected = new Uint8Array([
        0xef, 0xcd, 0xab, 0x89, 0x67, 0x45, 0x23, 0x01, 0xef, 0xcd, 0xab, 0x89,
        0x67, 0x45, 0x23, 0x01,
      ]);

      const result = ZkWasmUtil.hexStringsToBytes(hexStrings, chunksize);

      expect(result).toEqual(expected);
    });

    it("Should convert an array of U256 hex strings to a Uint8Array with chunksize", () => {
      const hexStrings: string[] = [];
      const chunksize = 32;

      for (let i = 0; i < 10; i++) {
        hexStrings.push(MAXU256_BN.toString(16));
      }
    });

    it("should throw an error for invalid hex string", () => {
      const hexStrings = ["invalid"];
      const chunksize = 8;

      expect(() => {
        ZkWasmUtil.hexStringsToBytes(hexStrings, chunksize);
      }).toThrow();
    });

    it("should throw an error for hex value larger than chunksize", () => {
      const hexStrings = ["0x0123456789abcdef"];
      const chunksize = 4;

      expect(() => {
        ZkWasmUtil.hexStringsToBytes(hexStrings, chunksize);
      }).toThrow();
    });
  });

  describe("HexStringsToBytesToHexString", () => {
    it("should convert an array of hex strings to a Uint8Array and convert back and string are same", () => {
      const hexStrings = ["0x0123456789abcdef", "0x0123456789abcdef"];
      const chunksize = 8;
      //We accept additional 0 before but the return string will remove it.
      const expected = ["0x123456789abcdef", "0x123456789abcdef"];

      const bytes = ZkWasmUtil.hexStringsToBytes(hexStrings, chunksize);
      const results = ZkWasmUtil.bytesToHexStrings(bytes, chunksize);

      expect(results).toEqual(expected);
    });
  });
});
