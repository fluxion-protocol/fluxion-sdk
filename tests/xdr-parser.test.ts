import { describe, it, expect } from 'vitest';
import { encodeParam, decodeResponse } from '../src/xdr/xdr-parser.js';
import { ParsingError } from '../src/errors/index.js';
import { nativeToScVal } from '@stellar/stellar-sdk';

describe('XDR Parser Utilities', () => {
  it('should securely encode u64 types', () => {
    const val = encodeParam(123456789n, 'u64');
    expect(val).toBeDefined();
    expect(val.switch().name).toBe('scvU64');
  });

  it('should handle native decoding correctly', () => {
    const val = nativeToScVal(100n, { type: 'i128' });
    const decoded = decodeResponse<bigint>(val);
    expect(decoded).toBe(100n);
  });

  it('should throw typed ParsingError on invalid encode', () => {
    expect(() => encodeParam(undefined, 'address')).toThrow(ParsingError);
  });

  it('should encode address types correctly', () => {
    const address = 'GDZST3XVCDTUJ76ZAV2HA72KYTZ4JJYZNVYGFIHX5DQAEJZQ5A4XEVB';
    const val = encodeParam(address, 'address');
    expect(val).toBeDefined();
  });

  it('should encode boolean types correctly', () => {
    const val = encodeParam(true, 'bool');
    expect(val).toBeDefined();
    expect(val.switch().name).toBe('scvBool');
  });

  it('should decode base64 XDR strings', () => {
    const val = nativeToScVal(42n, { type: 'u64' });
    const encoded = val.toXDR('base64');
    const decoded = decodeResponse<bigint>(encoded);
    expect(decoded).toBe(42n);
  });

  it('should throw ParsingError on empty response', () => {
    expect(() => decodeResponse(undefined)).toThrow(ParsingError);
    expect(() => decodeResponse(null)).toThrow(ParsingError);
  });

  it('should throw ParsingError on invalid base64', () => {
    expect(() => decodeResponse('!!!invalid!!!')).toThrow(ParsingError);
  });
});
