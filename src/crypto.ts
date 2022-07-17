import crypto from "crypto-js";

export const SHA256 = (data: string): string => {
  return crypto.SHA256(data).toString(crypto.enc.Hex);
};
