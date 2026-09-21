import { Logger } from "./logger.js";

const methods = ["log", "info", "warn", "error", "debug", "configure", "style"];

/** @type {Partial<Record<keyof Console, Function>>} */
const original = {};

const logger = new Logger();
for (const method of methods) {
  original[method] = console[method];

  const replacement = (...args) => {
    logger[method](...args);
  };

  console[method] = replacement;
}

/** @type {Logger} */ console = logger;

export function restore() {
  for (const method of methods) {
    console[method] = original[method];
  }
}
