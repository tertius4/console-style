# console-style

A tiny JavaScript package for styling terminal output with ANSI color codes and text formatting.

## Overview

`console-style` wraps the normal console methods and lets you apply formatting such as:

* bold text
* italic text
* text colors
* background colors

It is small, dependency-free, and designed for Node.js terminal output.

## Installation

```bash
npm i console-style
```

## Usage

### Local logger

Import the logger without modifying the global `console`:

```js
import logger from "console-style/logger";

logger.log("Hello from console-style");
logger.warn("Warning");
logger.error("Something went wrong");
```

The logger provides:

* `log()`
* `info()`
* `warn()`
* `error()`
* `debug()`

These methods behave like the standard console methods, but apply styling to string arguments.

### `logger.configure(styles)`

Configures the default style for individual log methods.

```js
import logger from "console-style/logger";

logger.configure({
	log: {
		color: "green",
	},

	warn: {
		color: "yellow",
	},

	error: {
		color: "red",
		bold: true,
	},
});
```

The configured styles are applied whenever the corresponding method is called:

```js
logger.log("Green log");
logger.warn("Yellow warning");
logger.error("Bold red error");
```

Configuration can be updated later. New properties are merged into the existing style for that method.

```js
logger.configure({
	error: {
		background: "yellow",
	},
});
```

The `error` style now contains the previously configured properties as well as the new background color.

### `logger.style(style)`

Creates a logger with the supplied style applied to its log methods.

```js
import logger from "console-style/logger";

logger
	.style({
		italic: true,
		color: "blue",
	})
	.log("Blue italic text");
```

The original logger is not modified:

```js
logger.log("Normal logger output");
```

The returned logger supports all standard logger methods:

```js
logger.style({ color: "cyan" }).log("Log");
logger.style({ color: "green" }).info("Info");
logger.style({ color: "yellow" }).warn("Warning");
logger.style({ color: "red" }).error("Error");
logger.style({ color: "magenta" }).debug("Debug");
```

## Global console patch

Importing the package without importing a specific export patches the global `console` object:

```js
import "console-style";

console.log("This is styled through the global console");
```

The global console gains the same logger configuration and styling API:

```js
console.configure({
	log: {
		color: "green",
	},

	error: {
		color: "red",
		bold: true,
	},
});

console.log("Green log");
console.error("Bold red error");
```

Temporary styling is also available:

```js
console
	.style({
		color: "cyan",
		bold: true,
	})
	.log("Temporary styled log");
```

The global patch replaces:

* `log`
* `info`
* `warn`
* `error`
* `debug`

and adds:

* `configure`
* `style`

The original console methods are preserved internally.

### Restore the original console

The original console methods can be restored:

```js
import { restore } from "console-style";

restore();

console.log("Back to the original console");
```

`restore()` removes the `console-style` modifications and restores the original console methods.

## Supported colors

The package supports these colors:

* `black`
* `red`
* `green`
* `yellow`
* `blue`
* `magenta`
* `cyan`
* `white`

The same names can also be used for backgrounds.

## Example

```js
import "console-style";

console.configure({
	log: {
		bold: true,
		color: "green",
	},

	error: {
		bold: true,
		color: "red",
	},
});

console.log("Green log");
console.error("Bold red error");

console
	.style({
		italic: true,
		color: "blue",
	})
	.log("Temporary blue italic log");
```

For a local logger that does not modify the global console:

```js
import logger from "console-style/logger";

logger.configure({
	log: {
		color: "green",
	},

	error: {
		color: "red",
	},
});

logger.log("Green log");
logger.error("Red error");

logger
	.style({
		italic: true,
		color: "blue",
	})
	.log("Blue italic log");
```

## Notes

* Styling is applied to string arguments only.
* Non-string values are passed through unchanged.
* Each log method can have its own default style.
* `style()` creates a separately styled logger and does not modify the existing logger configuration.
* The global import patches the global `console`.
* The `console-style/logger` import does not modify the global `console`.
* The package is designed for terminal output and developer tooling, not HTML or browser styling.
