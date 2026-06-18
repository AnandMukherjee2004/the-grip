import crypto from "crypto";

export class MissingEncryptionKeyError extends Error {
  constructor() {
    super("CREDENTIALS_ENCRYPTION_KEY environment variable is missing");
    this.name = "MissingEncryptionKeyError";
  }
}

export function getEncryptionKey(): Buffer {
  const keyB64 = process.env.CREDENTIALS_ENCRYPTION_KEY;
  if (!keyB64) {
    throw new MissingEncryptionKeyError();
  }
  const key = Buffer.from(keyB64, "base64");
  if (key.length !== 32) {
    throw new Error("CREDENTIALS_ENCRYPTION_KEY must be exactly 32 bytes when base64-decoded");
  }
  return key;
}

export function encryptCredentials(credentials: Record<string, string>): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12); // IV is 12 bytes for AES-GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  
  const plaintext = JSON.stringify(credentials);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final()
  ]);
  
  const authTag = cipher.getAuthTag(); // Auth tag is 16 bytes
  
  // Prepend IV and auth tag to ciphertext: [IV (12B)] [AuthTag (16B)] [Ciphertext]
  const fullBuffer = Buffer.concat([iv, authTag, encrypted]);
  return fullBuffer.toString("base64");
}

export function decryptCredentials(encB64: string): Record<string, string> {
  const key = getEncryptionKey();
  const fullBuffer = Buffer.from(encB64, "base64");
  
  if (fullBuffer.length < 28) {
    throw new Error("Invalid encrypted credentials length");
  }
  
  const iv = fullBuffer.subarray(0, 12);
  const authTag = fullBuffer.subarray(12, 28);
  const ciphertext = fullBuffer.subarray(28);
  
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  
  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final()
  ]);
  
  return JSON.parse(decrypted.toString("utf8"));
}
