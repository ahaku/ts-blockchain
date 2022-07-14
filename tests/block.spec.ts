import { SHA256 } from "./../src/crypto";
import assert from "assert";
import Block from "../src/block";
import Blockchain, { holderKeyPair } from "../src/blockchain";
import Transaction from "../src/transaction";

describe("Block class", () => {
  describe("Constructor", () => {
    it("should correctly initialize an instance", () => {
      const block = new Block(1, [], "0");
      const correctHash = SHA256(1 + JSON.stringify([]) + "0" + 0);

      assert.strictEqual(block.timestamp, 1);
      assert.deepStrictEqual(block.data, []);
      assert.strictEqual(block.hash, correctHash);
    });
  });

  describe("hasValidTransactions", () => {
    it("should correctly validate block transactions", () => {
      const blockchain = new Blockchain();
      const tx = new Transaction(
        holderKeyPair.getPublic("hex"),
        "some_address",
        999
      );
      tx.sign(holderKeyPair);
      const block = new Block(1, [tx], "0");
      blockchain.addBlock(block);
      assert(block.hasValidTransactions(blockchain));

      block.data.push(new Transaction("from", "to", 1));
      assert(!block.hasValidTransactions(blockchain));
    });
  });
});
