export type LogMethod =
	| "log"
	| "info"
	| "warn"
	| "error"
	| "debug";

export type Color =
	| "black"
	| "red"
	| "green"
	| "yellow"
	| "blue"
	| "magenta"
	| "cyan"
	| "white";

export interface LogStyle {
	bold?: boolean;
	italic?: boolean;
	color?: Color;
	background?: Color;
}

export type LoggerStyle = Partial<Record<LogMethod, LogStyle>>;

export declare class Logger {
	configure(style: LoggerStyle): void;

	style(style: LogStyle): Logger;

	log(...args: Parameters<Console["log"]>): void;
	info(...args: Parameters<Console["info"]>): void;
	warn(...args: Parameters<Console["warn"]>): void;
	error(...args: Parameters<Console["error"]>): void;
	debug(...args: Parameters<Console["debug"]>): void;
}

declare const logger: Logger;

export default logger;