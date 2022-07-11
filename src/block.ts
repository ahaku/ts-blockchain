import { SHA256 } from "./crypto";

export default class Block {
  timestamp: number;
  data: unknown[];
  previousHash: string;
  hash: string;

  constructor(
    timestamp: number,
    data: unknown[] = [],
    previousHash: string = ""
  ) {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.getHash();
  }

  getHash(): string {
    return SHA256(
      this.timestamp + JSON.stringify(this.data) + this.previousHash
    );
  }
}
