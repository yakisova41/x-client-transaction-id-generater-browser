// @ts-check

/**
 * @param {string} data
 * @returns {Promise<number[]>}
 */
export const encodeSha256 = async (data) => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashBytes = Array.from(new Uint8Array(hashBuffer));
  return hashBytes;
};

/**
 * @param {Uint8Array} data
 * @returns {string}
 */
export const encodeBase64 = (data) => {
  let binary = "";
  const len = data.length;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return btoa(binary).replace(/=/g, "");
};

/**
 * @param {string} data
 * @returns {number[]}
 */
export const decodeBase64 = (data) => {
  let base64 = data.replace(/-/g, "+").replace(/_/g, "/");
  const padding = base64.length % 4;
  if (padding > 0) {
    base64 += "=".repeat(4 - padding);
  }

  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

/**
 * @param {string} method
 * @param {string} path
 * @param {string} key
 * @param {string} animationKey
 * @returns {Promise<string>}
 */
export const generateTransactionId = async (method, path, key, animationKey) => {
  const DEFAULT_KEYWORD = "obfiowerehiring";
  const ADDITIONAL_RANDOM_NUMBER = 3;
  const timeNow = Math.floor((Date.now() - 1682924400 * 1000) / 1000);
  const timeNowBytes = [timeNow & 0xff, (timeNow >> 8) & 0xff, (timeNow >> 16) & 0xff, (timeNow >> 24) & 0xff];

  const data = `${method}!${path}!${timeNow}${DEFAULT_KEYWORD}${animationKey}`;

  const hashBytes = await encodeSha256(data);
  const keyBytes = decodeBase64(key);

  const randomNum = Math.floor(Math.random() * 256);
  const bytesArr = [...keyBytes, ...timeNowBytes, ...hashBytes.slice(0, 16), ADDITIONAL_RANDOM_NUMBER];

  const out = new Uint8Array([randomNum, ...bytesArr.map((item) => item ^ randomNum)]);

  const base64 = encodeBase64(out);
  return base64;
};
