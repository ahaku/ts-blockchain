import { SHA256 } from "./crypto";

export default class Block {
  timestamp: number;
  data: unknown[];
  previousHash: string;
  hash: string;
  nonce: number;

  constructor(
    timestamp: number,
    data: unknown[] = [],
    previousHash: string = ""
  ) {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.getHash();
  }

  getHash(): string {
    return SHA256(
      this.timestamp +
        JSON.stringify(this.data) +
        this.previousHash +
        this.nonce
    );
  }

  mine(difficulty: number): void {
    while ("0".repeat(difficulty) !== this.hash.substring(0, difficulty)) {
      this.nonce++;
      this.hash = this.getHash();
    }
  }
}
