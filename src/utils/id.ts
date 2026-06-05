/**
 * RFC-4122 v4 UUID generator. IDs are generated client-side so a row has a
 * stable identity before it ever reaches the server (offline-first).
 *
 * Uses crypto.getRandomValues when available (provided by the RN runtime /
 * expo), otherwise falls back to Math.random — adequate for local IDs.
 */
export function uuidv4(): string {
  const bytes = new Uint8Array(16);
  const cryptoObj = (globalThis as { crypto?: Crypto }).crypto;
  if (cryptoObj?.getRandomValues) {
    cryptoObj.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  // Per spec: version + variant bits.
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex: string[] = [];
  for (let i = 0; i < 256; i += 1) hex.push((i + 0x100).toString(16).slice(1));
  return (
    hex[bytes[0]!]! +
    hex[bytes[1]!]! +
    hex[bytes[2]!]! +
    hex[bytes[3]!]! +
    '-' +
    hex[bytes[4]!]! +
    hex[bytes[5]!]! +
    '-' +
    hex[bytes[6]!]! +
    hex[bytes[7]!]! +
    '-' +
    hex[bytes[8]!]! +
    hex[bytes[9]!]! +
    '-' +
    hex[bytes[10]!]! +
    hex[bytes[11]!]! +
    hex[bytes[12]!]! +
    hex[bytes[13]!]! +
    hex[bytes[14]!]! +
    hex[bytes[15]!]!
  );
}

export const nowIso = (): string => new Date().toISOString();
