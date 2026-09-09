export const MAX_PIN_ATTEMPTS = 3;

export async function hashPin(pin: string): Promise<string> {
  const enc = new TextEncoder().encode(pin);
  const hashBuffer = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}