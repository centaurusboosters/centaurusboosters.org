import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { validateSignature } from '../src/validator.js';

function makeSignature(payload: Buffer, secret: string): string {
  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  return `sha256=${hmac.digest('hex')}`;
}

describe('validateSignature', () => {
  const secret = 'test-secret-value';
  const payload = Buffer.from('{"action":"opened"}', 'utf8');

  it('returns true for a valid signature', () => {
    const sig = makeSignature(payload, secret);
    expect(validateSignature(payload, sig, secret)).toBe(true);
  });

  it('returns false when the payload is tampered', () => {
    const sig = makeSignature(payload, secret);
    const tamperedPayload = Buffer.from('{"action":"closed"}', 'utf8');
    expect(validateSignature(tamperedPayload, sig, secret)).toBe(false);
  });

  it('returns false when the secret is wrong', () => {
    const sig = makeSignature(payload, 'wrong-secret');
    expect(validateSignature(payload, sig, secret)).toBe(false);
  });

  it('returns false for a malformed header (no sha256= prefix)', () => {
    expect(validateSignature(payload, 'notavalidheader', secret)).toBe(false);
  });

  it('returns false for an empty signature', () => {
    expect(validateSignature(payload, '', secret)).toBe(false);
  });

  it('returns false for a missing signature (undefined cast to string)', () => {
    expect(validateSignature(payload, undefined as unknown as string, secret)).toBe(false);
  });

  it('returns false when signature has correct prefix but wrong hex', () => {
    expect(validateSignature(payload, 'sha256=0000000000000000000000000000000000000000000000000000000000000000', secret)).toBe(false);
  });
});
