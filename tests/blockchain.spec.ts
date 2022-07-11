import assert from "assert";
import Block from "../src/block";
import Blockchain from "../src/blockchain";

describe("Blockchain class", () => {
  describe("Constructor", () => {
    it("should correctly initialize an instance", () => {
      const blockchain = new Blockchain();

      assert(blockchain.chain.length === 1);
    });
  });

  describe("createGenesisBlock", () => {
    it("should correctly create a genesis block", () => {
      const blockchain = new Blockchain();
      const genesisBlock = blockchain.createGenesisBlock();
      assert(genesisBlock instanceof Block);
    });
  });

  describe("getLatestBlock", () => {
    it("should return the latest block of the chain", () => {
      const blockchain = new Blockchain();

      assert.deepStrictEqual(blockchain.getLatestBlock(), blockchain.chain[0]);
    });
  });

  describe("addBlock", () => {
    it("should add a block to the chain", () => {
      const blockchain = new Blockchain();
      const blockToAdd = new Block(2, []);

      blockchain.addBlock(blockToAdd);

      assert.deepStrictEqual(blockchain.getLatestBlock(), blockToAdd);
    });
  });

  describe("isValid", () => {
    it("should return true if the chain is valid", () => {
      const blockchain = new Blockchain();
      const blockToAdd = new Block(2, []);

      blockchain.addBlock(blockToAdd);

      assert(
        blockchain
          .getLatestBlock()
          .hash.startsWith("0".repeat(blockchain.difficulty))
      );
      assert(blockchain.isValid());
    });

    it("should return false if the chain is invalid", () => {
      const blockchain = new Blockchain();
      const blockToAdd = new Block(2, []);
      blockchain.addBlock(blockToAdd);
      blockchain.chain[1].data.push("hack");

      assert(!blockchain.isValid());
    });
  });
});
