import logger from "../logger.js";

const methods = ["log", "info", "warn", "error", "debug", "configure", "style"];

/** @type {Partial<Record<keyof Console, Function>>} */
const original = {};


for (const method of methods) {
  original[method] = console[method];

  const replacement = (...args) => {
    logger[method](...args);
  };

  console[method] = replacement;
}

export function restore() {
  for (const method of methods) {
    console[method] = original[method];
  }
}
