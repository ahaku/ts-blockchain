import { SHA256 } from "./../src/crypto";
import assert from "assert";
import Block from "../src/block";

describe("Block class", () => {
  describe("Constructor", () => {
    it("should correctly initialize an instance", () => {
      const block = new Block(1, [], "0");
      const correctHash = SHA256(1 + JSON.stringify([]) + "0");

      assert.strictEqual(block.timestamp, 1);
      assert.deepStrictEqual(block.data, []);
      assert.strictEqual(block.hash, correctHash);
    });
  });
});
