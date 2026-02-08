// @ts-check

import { getAnimationKey } from "./convert.js";
import { generateTransactionId, decodeBase64 } from "./encode.js";
import { never } from "./tool.js";
/**
 * @returns {Promise<object>}
 */
const getUserAgent = async () => {
  const github = "https://raw.githubusercontent.com";
  const ua = "/fa0311/latest-user-agent/refs/heads/main/header.json";
  const raw = await fetch(`${github}${ua}`, {
    method: "GET",
  });
  const json = await raw.json();
  const ignore = ["host", "connection"];

  return Object.fromEntries(
    Object.entries(json).map(([key, value]) => {
      const filtered = Object.fromEntries(Object.entries(value).filter(([key]) => !ignore.includes(key)));
      return [key, filtered];
    })
  );
};

/**
 * @param {{[key: string]: string}} cookie
 * @returns {string}
 */
const cookieEncode = (cookie) => {
  return Object.entries(cookie)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");
};

/**
 * @param {{[key: string]: string}} cookies
 * @returns {Promise<{get: (method: string, path: string) => Promise<string>}>}
 */
export const createSession = async (cookies) => {
  const userAgent = await getUserAgent();

  const raw = await fetch("https://x.com", {
    method: "GET",
    headers: {
      ...userAgent["chrome"],
      Cookie: cookieEncode(cookies),
    },
  });
  const html = await raw.text();
  const root = document.createElement("div");
  root.innerHTML = html;
  const content = root.querySelector("[name^=tw]")?.getAttribute("content") ?? never("No content");
  const verification = decodeBase64(content);
  const frames = root.querySelectorAll("[id^='loading-x-anim']");
  const svgArray = svgKey(verification, frames);
  const indexKey = [38, 29, 43, 3];
  const animationKey = getAnimationKey(svgArray, verification, indexKey);
  return {
    get: (method, path) => generateTransactionId(method, path, content, animationKey.join("")),
  };
};

/**
 * @param {number[]} verification
 * @param {NodeListOf<Element>} frames
 */
const svgKey = (verification, frames) => {
  const index = verification[5] % 4;
  const path = frames[index].children[0].children[1];
  const d = path.getAttribute("d") ?? never("No d");
  const sub = d.substring(9).split("C");
  const res = sub.map((item) => {
    return item
      .replace(/[^\d]+/g, " ")
      .trim()
      .split(" ")
      .map(Number);
  });
  return res;
};
export { generateTransactionId } from "./encode.js";
export { decodeTransactionId } from "./decode.js";
