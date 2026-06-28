import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";
import { createMMKV, type MMKV } from "react-native-mmkv";

/**
 * Supabase session JSON (access + refresh JWTs + user metadata) routinely
 * exceeds SecureStore's safe per-item size (~2KB on iOS), so it can't be
 * stored there directly. Instead: SecureStore holds only a small random
 * encryption key, and the actual session is stored in encrypted MMKV
 * (no practical size limit). Neither piece alone is useful without the other.
 */
const ENCRYPTION_KEY_NAME = "scp-portal-mmkv-key";

// AES-256 requires a key that is exactly 32 bytes. Mapping each random byte to a
// printable ASCII character (33-126) guarantees a single UTF-8 byte per character,
// so a 32-character string is always exactly 32 bytes.
async function getOrCreateEncryptionKey(): Promise<string> {
  const existing = await SecureStore.getItemAsync(ENCRYPTION_KEY_NAME);
  if (existing) return existing;

  const bytes = await Crypto.getRandomBytesAsync(32);
  const key = Array.from(bytes, (b) => String.fromCharCode(33 + (b % 94))).join("");
  await SecureStore.setItemAsync(ENCRYPTION_KEY_NAME, key);
  return key;
}

let mmkvPromise: Promise<MMKV> | null = null;

function getMmkv(): Promise<MMKV> {
  if (!mmkvPromise) {
    mmkvPromise = getOrCreateEncryptionKey().then((encryptionKey) =>
      createMMKV({
        id: "scp-portal-session",
        encryptionKey,
        encryptionType: "AES-256",
      })
    );
  }
  return mmkvPromise;
}

/** Implements the storage interface Supabase's createClient() expects. */
export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    const mmkv = await getMmkv();
    return mmkv.getString(key) ?? null;
  },
  async setItem(key: string, value: string): Promise<void> {
    const mmkv = await getMmkv();
    mmkv.set(key, value);
  },
  async removeItem(key: string): Promise<void> {
    const mmkv = await getMmkv();
    mmkv.remove(key);
  },
};
