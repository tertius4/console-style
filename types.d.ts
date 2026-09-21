import type { Logger, LogMethod, LogStyle } from './logger.js';

export {};

declare global {
  interface Console {
    configure(config: Partial<Record<LogMethod, LogStyle>>): void;

    style(style: LogStyle): Logger;
  }
}
