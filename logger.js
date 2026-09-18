import ANSI from "./ANSI.js";
import "../types.js";

const methods = ["log", "info", "warn", "error", "debug"];

const original = {
  log: console.log.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  debug: console.debug.bind(console),
};

/** @type {Record<LogMethod, LogStyle>} */
const defaultStyles = {
  log: {},
  info: {},
  warn: {},
  error: {},
  debug: {},
};
/** @type {LogStyle} */
let temporaryStyle = {};

/**
 * @param {LogStyle | Partial<Record<LogMethod, LogStyle>> | undefined} style
 */
function configure(style = {}) {
  if (!style || typeof style !== "object") return;

  const hasMethodStyles = methods.some((method) => method in style && style[method] && typeof style[method] === "object");

  if (hasMethodStyles) {
    for (const method of methods) {
      const methodStyle = style[method];
      if (methodStyle) {
        defaultStyles[method] = {
          ...defaultStyles[method],
          ...methodStyle,
        };
      }
    }
    return;
  }

  for (const method of methods) {
    defaultStyles[method] = {
      ...defaultStyles[method],
      ...style,
    };
  }
}

/**
 * @param {LogStyle} style
 */
function style(newStyle) {
  temporaryStyle = {
    ...newStyle,
  };
  return logger;
}

/**
 * @param {string} text
 * @param {LogStyle} style
 */
function styleText(text, style) {
  let prefix = "";

  if (style.bold) prefix += ANSI.bold;
  if (style.italic) prefix += ANSI.italic;
  if (style.color) prefix += ANSI.color[style.color];
  if (style.background) prefix += ANSI.background[style.background];

  return prefix ? `${prefix}${text}${ANSI.reset}` : text;
}

/**
 * @param {unknown[]} args
 * @param {LogMethod} method
 */
function formatArgs(args = [], method) {
  const mergedStyle = {
    ...defaultStyles[method],
    ...temporaryStyle,
  };
  temporaryStyle = {};

  return args.map((arg) => (typeof arg === "string" ? styleText(arg, mergedStyle) : arg));
}

/**
 * @param {LogMethod} method
 */
function createMethod(method) {
  return (...args) => {
    original[method](...formatArgs(args, method));
  };
}

const logger = {
  configure,
  style,

  log: createMethod("log"),
  info: createMethod("info"),
  warn: createMethod("warn"),
  error: createMethod("error"),
  debug: createMethod("debug"),
};

export default logger;
