# console-style

A tiny JavaScript package for styling terminal output with ANSI color codes and text formatting.

## Overview

`console-style` wraps the normal console methods and lets you apply formatting such as:

- bold text
- italic text
- text colors
- background colors

It is small, dependency-free, and designed for Node.js terminal output.

## Installation

```bash
npm i console-style
```

## Usage

### `logger.configure(style)`

Applies a default style to the logger. You can pass either:

1. a single style object for all log methods, or
2. a method-specific style map.

```js
import logger from "console-style/logger.js";

logger.configure({ color: "green", bold: true });
logger.log("Hello from console-style");

logger.configure({
  log: { color: "green" },
  warn: { color: "yellow" },
  error: { color: "red" },
});
```

### `logger.style(style)`

Applies a style to the next chained log call only.

```js
import logger from "console-style/logger.js";

logger.style({ italic: true, color: "blue" }).log("Blue italic text");
logger.log("Normal text again");
```

### `logger.log(...)`, `logger.info(...)`, `logger.warn(...)`, `logger.error(...)`, `logger.debug(...)`

These methods behave like the standard console methods, but they apply styling to string arguments.

## Global console patch

```js
import "console-style";

console.configure({ color: "magenta", bold: true });
console.log("This is styled through the global console");
console.style({ color: "cyan" }).log("Temporary style");
```

This patches the global `console` object and replaces:

- `log`
- `info`
- `warn`
- `error`
- `debug`
- `configure`
- `style`

### Restore the original console

```js
import { restore } from "console-style";

restore();
console.log("Back to the original console");
```

## Supported colors

The package supports these colors:

- `black`
- `red`
- `green`
- `yellow`
- `blue`
- `magenta`
- `cyan`
- `white`

The same names can also be used for backgrounds.

## Example

```js
import { restore } from "console-style";
import logger from "console-style/logger.js";

console.configure({ bold: true, color: "green" });
console.log("Hello again!");

logger.configure({ color: "red" });
logger.style({ italic: true, color: "blue" }).log("Styled log message");
logger.log("Normal logger output");

restore();
```

## Notes

- Styling is applied to string arguments only.
- Non-string values are passed through unchanged.
- This package is designed for terminal output and developer tooling, not HTML or browser styling.

## License

ISC
