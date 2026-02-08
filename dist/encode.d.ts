export function encodeSha256(data: string): Promise<number[]>;
export function encodeBase64(data: Uint8Array): string;
export function decodeBase64(data: string): number[];
export function generateTransactionId(method: string, path: string, key: string, animationKey: string): Promise<string>;
