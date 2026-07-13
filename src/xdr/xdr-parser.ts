import { nativeToScVal, scValToNative, xdr } from '@stellar/stellar-sdk';
import { ParsingError } from '../errors/index.js';

type ScValType = 'address' | 'i128' | 'u64' | 'u32' | 'symbol' | 'bool';

/**
 * Encodes native JavaScript values to Soroban XDR ScVal format.
 * Provides type-safe encoding with comprehensive error handling.
 *
 * @param value - The value to encode
 * @param type - The target XDR type
 * @returns Encoded XDR ScVal
 * @throws ParsingError if encoding fails
 */
export function encodeParam(value: unknown, type: ScValType): xdr.ScVal {
  if (value === null || value === undefined) {
    throw new ParsingError(`Cannot encode null or undefined value as type ${type}`);
  }

  try {
    return nativeToScVal(value, { type });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new ParsingError(`Failed to encode parameter of type ${type}: ${errorMessage}`);
  }
}

/**
 * Decodes XDR ScVal to native JavaScript types with type safety.
 * Handles both base64-encoded and direct ScVal objects.
 *
 * @param scVal - The XDR ScVal or base64 string to decode
 * @returns Decoded native value of type T
 * @throws ParsingError if decoding fails or input is empty
 */
export function decodeResponse<T>(scVal: xdr.ScVal | string | undefined): T {
  if (!scVal) {
    throw new ParsingError('Empty XDR Response received');
  }

  try {
    let value: xdr.ScVal;

    if (typeof scVal === 'string') {
      value = xdr.ScVal.fromXDR(scVal, 'base64');
    } else {
      value = scVal;
    }

    return scValToNative(value) as T;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new ParsingError(`Failed to parse SCVal to Native: ${errorMessage}`);
  }
}
