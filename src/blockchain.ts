import Block from "./block";

export default class Blockchain {
  chain: Block[];
  difficulty: number = 1;

  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock(): Block {
    return new Block(0);
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

  isValid(): boolean {
    return this.chain.slice(1).every((block, idx) => {
      const prevBlock = this.chain[idx];

      return (
        block.hash === block.getHash() && block.previousHash === prevBlock.hash
      );
    });
  }
}
