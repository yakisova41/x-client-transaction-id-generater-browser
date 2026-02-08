// @ts-check

/**
 * @param {...any} args
 * @returns {never}
 */
export const never = (...args) => {
  throw new Error(...args);
};
