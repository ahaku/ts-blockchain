import EC from "elliptic";
const ec = new EC.ec("secp256k1");
import Blockchain, { MINTING_PUBLIC_ADDRESS } from "./blockchain";
import { SHA256 } from "./crypto";

export default class Transaction {
  from: string;
  to: string;
  amount: number;
  signature: string = "";
  gas: number;

  constructor(from: string, to: string, amount: number, gas = 0) {
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.gas = gas;
  }

  sign(keyPair: EC.ec.KeyPair) {
    if (keyPair.getPublic("hex") === this.from) {
      this.signature = keyPair
        .sign(SHA256(this.from + this.to + this.amount + this.gas), "base64")
        .toDER("hex");
    }
  }

  isValid(tx: Transaction, chain: Blockchain): boolean {
    return Boolean(
      tx.from &&
        tx.to &&
        tx.amount &&
        (chain.getBalance(tx.from) >= tx.amount + tx.gas ||
          tx.from === MINTING_PUBLIC_ADDRESS) &&
        ec
          .keyFromPublic(tx.from, "hex")
          .verify(SHA256(tx.from + tx.to + tx.amount + tx.gas), tx.signature)
    );
  }
}
