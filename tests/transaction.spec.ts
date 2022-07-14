import assert from "assert";
import Blockchain, { holderKeyPair } from "../src/blockchain";
import { SHA256 } from "../src/crypto";
import Transaction from "../src/transaction";
import { testKeyPair, testPublicKey } from "./helpers";

describe("Transaction class", () => {
  describe("Constructor", () => {
    it("should correctly initialize an instance", () => {
      const tx = new Transaction("from", "to", 1);
      assert.equal(tx.from, "from");
      assert.equal(tx.to, "to");
      assert.equal(tx.amount, 1);
      assert.equal(tx.gas, 0);
    });
  });

  describe("sign", () => {
    it("should correctly sign a transaction", () => {
      const tx = new Transaction(testPublicKey, "to", 1);
      tx.sign(testKeyPair);
      assert.strictEqual(
        tx.signature,
        testKeyPair
          .sign(SHA256(tx.from + tx.to + tx.amount + tx.gas), "base64")
          .toDER("hex")
      );
    });
  });

  describe("isValid", () => {
    it("should return true if the transaction is valid", () => {
      const blockchain = new Blockchain();
      const tx = new Transaction(
        holderKeyPair.getPublic("hex"),
        "some_address",
        999
      );
      tx.sign(holderKeyPair);
      assert(tx.isValid(tx, blockchain));
    });

    it("should return false if the transaction is invalid", () => {
      const blockchain = new Blockchain();
      const tx = new Transaction(testPublicKey, "some_address", 999);
      tx.sign(testKeyPair);
      assert(!tx.isValid(tx, blockchain));
    });
  });
});
