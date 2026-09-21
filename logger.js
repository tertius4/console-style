import ANSI from "./ANSI.js";

/**
 * @typedef {'log' | 'info' | 'warn' | 'error' | 'debug'} LogMethod
 */

/**
 * @typedef {'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white'} Color
 */

/**
 * @typedef {Object} LogStyle
 * @property {boolean} [bold]
 * @property {boolean} [italic]
 * @property {Color} [color]
 * @property {Color} [background]
 */

/** @type {LogMethod[]} */
const methods = ["log", "info", "warn", "error", "debug"];
const original = {
  log: console.log.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  debug: console.debug.bind(console),
};

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

export class Logger {
  /** @type {Record<LogMethod, LogStyle>} */
  #style = {
    log: {},
    info: {},
    warn: {},
    error: {},
    debug: {},
  };

  /**
   * @param {{ [key in LogMethod]?: LogStyle }} style
   */
  configure(style) {
    if (!style || typeof style !== "object") return;

    const hasMethodStyles = methods.some(
      (method) => method in style && style[method] && typeof style[method] === "object",
    );
    if (!hasMethodStyles) return;

    for (const method of methods) {
      const methodStyle = style[method];
      if (!methodStyle) continue;

      this.#style[method] = {
        ...this.#style[method],
        ...methodStyle,
      };
    }
  }

  /**
   * @param {LogStyle} newStyle
   * @returns {Logger}
   */
  style(newStyle) {
    const temp_logger = new Logger();
    temp_logger.configure({
      log: newStyle,
      info: newStyle,
      warn: newStyle,
      error: newStyle,
      debug: newStyle,
    });
    return temp_logger;
  }

  log = this.#createMethod("log");
  info = this.#createMethod("info");
  warn = this.#createMethod("warn");
  error = this.#createMethod("error");
  debug = this.#createMethod("debug");

  /**
   * @param {LogMethod} method
   */
  #createMethod(method) {
    return (...args) => {
      original[method](...this.#formatArgs(args, method));
    };
  }

  /**
   * @param {unknown[]} args
   * @param {LogMethod} method
   */
  #formatArgs(args = [], method) {
    const style = this.#style[method];

    const isBrowser = typeof globalThis.window !== "undefined" && typeof globalThis.document !== "undefined";
    if (!isBrowser) {
      return args.map((arg) => (typeof arg === "string" ? styleText(arg, style) : arg));
    }

    const formatted = [];
    const styles = [];

    for (const arg of args) {
      if (typeof arg === "string") {
        formatted.push("%c" + arg);
        styles.push(this.#cssStyle(style));
      } else {
        formatted.push("%o");
        styles.push(arg);
      }
    }

    return [formatted.join(" "), ...styles];
  }

  /**
   * @param {LogStyle} style
   */
  #cssStyle(style) {
    const css = [];

    if (style.bold) {
      css.push("font-weight: bold");
    }

    if (style.italic) {
      css.push("font-style: italic");
    }

    if (style.color) {
      css.push(`color: ${style.color}`);
    }

    if (style.background) {
      css.push(`background-color: ${style.background}`);
    }

    return css.join("; ");
  }
}

export default new Logger();
