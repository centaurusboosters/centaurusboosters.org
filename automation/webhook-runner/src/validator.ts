import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Validates a GitHub webhook HMAC-SHA256 signature.
 * The signature header from GitHub is in the form "sha256=<hex>".
 * Never throws — returns false on any error or malformed input.
 */
export function validateSignature(
  payload: Buffer,
  signature: string,
  secret: string,
): boolean {
  try {
    if (!signature || !secret) return false;

    const prefix = 'sha256=';
    if (!signature.startsWith(prefix)) return false;

    const expected = createHmac('sha256', secret).update(payload).digest('hex');
    const expectedBuf = Buffer.from(`${prefix}${expected}`, 'utf8');
    const actualBuf = Buffer.from(signature, 'utf8');

    // Lengths must match for timingSafeEqual
    if (expectedBuf.length !== actualBuf.length) return false;

    return timingSafeEqual(expectedBuf, actualBuf);
  } catch {
    return false;
  }
}
