import EC from "elliptic";
const ec = new EC.ec("secp256k1");

import Block from "./block";
import Transaction from "./transaction";

const MINTING_KEY_PAIR = ec.genKeyPair();
export const MINTING_PUBLIC_ADDRESS = MINTING_KEY_PAIR.getPublic("hex");
export const holderKeyPair = ec.genKeyPair();

export default class Blockchain {
  chain: Block[];
  difficulty: number = 1;
  transactions: Transaction[] = [];
  reward: number = 100;

  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock(): Block {
    const releaseTransaction = new Transaction(
      MINTING_PUBLIC_ADDRESS,
      holderKeyPair.getPublic("hex"),
      10_000
    );
    releaseTransaction.sign(MINTING_KEY_PAIR);
    return new Block(+new Date(), [releaseTransaction]);
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  addBlock(block: Block) {
    // add previous block hast to the new block
    block.previousHash = this.getLatestBlock().hash;

    // calculate the hash of the new block
    block.hash = block.getHash();

    // mine the block
    block.mine(this.difficulty);

    // add the new block to the chain
    this.chain.push(Object.freeze(block));
  }

  addTransaction(transaction: Transaction) {
    if (transaction.isValid(transaction, this)) {
      this.transactions.push(transaction);
    }
  }

  mineTransactions(rewardAddress: string) {
    const gas = this.transactions.reduce((acc, curr) => acc + curr.gas, 0);

    // A reward transaction
    const rewardTx = new Transaction(
      MINTING_PUBLIC_ADDRESS,
      rewardAddress,
      this.reward + gas
    );
    rewardTx.sign(MINTING_KEY_PAIR);

    if (this.transactions.length !== 0)
      this.addBlock(
        new Block(Date.now(), [
          // reward for mining the block
          rewardTx,
          // all the rest of the transactions
          ...this.transactions,
        ])
      );

    this.transactions = [];
  }

  getBalance(address: string): number {
    let balance = 0;

    this.chain.forEach((block) => {
      block.data.forEach((transaction) => {
        if (transaction.from === address) {
          balance -= transaction.amount;
          balance -= transaction.gas;
        }

        if (transaction.to === address) {
          balance += transaction.amount;
        }
      });
    });

    return balance;
  }

  isValid(): boolean {
    return this.chain.slice(1).every((block, idx) => {
      const prevBlock = this.chain[idx];

      return (
        block.hash === block.getHash() &&
        block.previousHash === prevBlock.hash &&
        block.hasValidTransactions(this)
      );
    });
  }
}
