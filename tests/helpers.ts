import EC from "elliptic";
const ec = new EC.ec("secp256k1");

export const testKeyPair = ec.genKeyPair();
export const testPrivateKey = testKeyPair.getPrivate("hex");
export const testPublicKey = testKeyPair.getPublic("hex");
