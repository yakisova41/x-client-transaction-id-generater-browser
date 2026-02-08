// @ts-check

/**
 * @param {number[]} timeBytes
 * @returns {Date}
 */
const decodeTimeFromBytes = (timeBytes) => {
  const timeValue = timeBytes.reverse().reduce((acc, value) => (acc << 8) | value, 0);
  const baseTime = 1682924400;
  const actualTime = timeValue + baseTime;
  const date = new Date(actualTime * 1000);
  return date;
};

/**
 * @param {string} transactionId
 * @returns {{keyBytes: number[], time: Date, hashBytes: number[], additional: number}}
 */
export const decodeTransactionId = (transactionId) => {
  let base = transactionId.replace(/-/g, "+").replace(/_/g, "/");
  const padding = base.length % 4;
  if (padding > 0) {
    base += "=".repeat(4 - padding);
  }

  const binaryString = atob(base);
  const len = binaryString.length;
  const rand = binaryString.charCodeAt(0);

  const data = new Array(len - 1);
  for (let i = 1; i < len; i++) {
    data[i - 1] = binaryString.charCodeAt(i) ^ rand;
  }

  const keyBytes = data.slice(0, 48);
  const timeNowBytes = data.slice(48, 52);
  const hashBytes = data.slice(52, 68);
  const additional = data[68];

  return {
    keyBytes,
    time: decodeTimeFromBytes(timeNowBytes),
    hashBytes,
    additional,
  };
};
