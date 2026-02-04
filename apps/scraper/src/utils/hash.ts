import crypto from "crypto";

export function createContentHash(data: Record<string, any>) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");
}
