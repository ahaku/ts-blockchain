import assert from "assert";
import Block from "../src/block";
import Blockchain, {
  holderKeyPair,
  MINTING_PUBLIC_ADDRESS,
} from "../src/blockchain";
import Transaction from "../src/transaction";
import { testKeyPair, testPrivateKey, testPublicKey } from "./helpers";

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

  describe("addTransaction", () => {
    it("should add a transaction to the pending transactions", () => {
      const blockchain = new Blockchain();
      const holderToUserTx = new Transaction(
        holderKeyPair.getPublic("hex"),
        testPublicKey,
        50,
        10
      );
      holderToUserTx.sign(holderKeyPair);
      blockchain.addTransaction(holderToUserTx);
      assert(blockchain.transactions.length === 1);
    });
  });

  describe("mineTransactions", () => {
    it("should add a block to the chain", () => {
      const blockchain = new Blockchain();
      const transactionToAdd = new Transaction(
        holderKeyPair.getPublic("hex"),
        "some_address",
        1,
        0.1
      );
      transactionToAdd.sign(holderKeyPair);
      blockchain.addTransaction(transactionToAdd);
      blockchain.mineTransactions("reward_address");
      assert(blockchain.chain.length === 2);
    });
  });

  describe("getBalance", () => {
    it("should return the balance of given address", () => {
      const blockchain = new Blockchain();
      const balanceOfHolder = blockchain.getBalance(
        holderKeyPair.getPublic("hex")
      );
      assert(balanceOfHolder === 10_000);
    });

    it("should correctly count gas fee", () => {
      const blockchain = new Blockchain();
      assert.strictEqual(
        blockchain.getBalance(holderKeyPair.getPublic("hex")),
        10_000
      );

      const holderToUserTx = new Transaction(
        holderKeyPair.getPublic("hex"),
        testPublicKey,
        500,
        20
      );
      holderToUserTx.sign(holderKeyPair);

      blockchain.addTransaction(holderToUserTx);
      blockchain.mineTransactions(testPublicKey);
      assert.strictEqual(
        blockchain.getBalance(holderKeyPair.getPublic("hex")),
        // new balance should be equal:
        // 10000 [start balance] - 500 [sent to another user] - 20 [gas fee]
        9480
      );

      assert.strictEqual(
        blockchain.getBalance(testPublicKey),
        // another's user balance should be equal:
        // 0 [start balance] + 500 [received from holder user] + 100 [reward for mining] + 20 [gas fee]
        620
      );
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
      blockchain.chain[1].data.push(new Transaction("from", "to", 123));

      assert(!blockchain.isValid());
    });
  });
});
