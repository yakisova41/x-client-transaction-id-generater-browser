export function decodeTransactionId(transactionId: string): {
    keyBytes: number[];
    time: Date;
    hashBytes: number[];
    additional: number;
};
