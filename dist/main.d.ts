export function createSession(cookies: {
    [key: string]: string;
}): Promise<{
    get: (method: string, path: string) => Promise<string>;
}>;
export { generateTransactionId } from "./encode.js";
export { decodeTransactionId } from "./decode.js";
