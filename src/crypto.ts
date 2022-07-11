import crypto from "crypto";

export const SHA256 = (data: string): string => {
  return crypto.createHash("sha256").update(data).digest("hex");
};
