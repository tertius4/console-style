# styling-console

A tiny, dependency-free JavaScript package for styling `console` output in Node.js terminals and browser DevTools.

[![npm version](https://img.shields.io/npm/v/styling-console.svg)](https://www.npmjs.com/package/styling-console)
[![License](https://img.shields.io/npm/l/styling-console.svg)](https://github.com/tertius4/styling-console/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/tertius4/styling-console.svg)](https://github.com/tertius4/styling-console/issues)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/styling-console)](https://bundlephobia.com/package/styling-console)

## Overview

`styling-console` wraps the standard console methods and lets you apply formatting such as:

- bold text
- italic text
- text colors
- background colors

The same API works in both Node.js and browsers. The package automatically uses ANSI escape codes for terminal output and CSS formatting for browser DevTools.

## Table of Contents

- [Usage](#usage)
  - [Local logger](#local-logger)
  - [Global console](#global-console)
    - [Restore the original console](#restore-the-original-console)
  - [Browser and Node.js support](#browser-and-nodejs-support)
- [Supported styles](#supported-styles)
- [Complete example](#complete-example)
- [Notes](#notes)

## Installation

```bash
npm i styling-console
```

## Usage

There are two ways to use `styling-console`:

- **Local logger** — use `logger` without modifying the global `console`.
- **Global console** — patch the global `console` by importing the package directly.

---

### Local logger

Import the logger without modifying the global `console`:

```js
import logger from "styling-console/logger";

logger.log("Hello from styling-console");
logger.info("Information");
logger.warn("Warning");
logger.error("Something went wrong");
logger.debug("Debug information");
```

The logger provides:

- `log()`
- `info()`
- `warn()`
- `error()`
- `debug()`

These methods behave like the standard console methods, but apply styling to string arguments.

#### `logger.configure(styles)`

Configures the default style for individual log methods.

```js
import logger from "styling-console/logger";

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

Configuration can be updated later. New properties are merged into the existing style for that method:

```js
logger.configure({
  error: {
    background: "yellow",
  },
});
```

The existing `error` style is preserved and the new background color is added.

#### `logger.style(style)`

Creates a separately styled logger without modifying the original logger's configuration:

```js
import logger from "styling-console/logger";

logger
  .style({
    italic: true,
    color: "blue",
  })
  .log("Blue italic text");
```

The original logger remains unchanged:

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

---

### Global console

Importing the package directly patches the global `console`:

```js
import "styling-console";

console.log("This is styled through the global console");
```

The global console gains the same configuration and styling API:

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

- `log`
- `info`
- `warn`
- `error`
- `debug`

and adds:

- `configure`
- `style`

The original console methods are preserved internally and can be restored.

#### Restore the original console

```js
import { restore } from "styling-console";

restore();

console.log("Back to the original console");
```

`restore()` restores the original console methods and removes the `styling-console` modifications.

---

## Browser and Node.js support

`styling-console` automatically detects the runtime and formats output accordingly.

### Node.js

In Node.js, styles are applied using ANSI escape codes:

```js
logger.log("Hello");
```

produces styled terminal output.

### Browser

In browser DevTools, styles are applied using `%c` and CSS:

```js
logger.log("Hello");
```

produces styled output in the browser console.

No separate browser API is required.

---

## Supported styles

### Text formatting

- `bold`
- `italic`

### Colors

- `black`
- `red`
- `green`
- `yellow`
- `blue`
- `magenta`
- `cyan`
- `white`

The same colors can be used for backgrounds.

For example:

```js
logger
  .style({
    bold: true,
    italic: true,
    color: "cyan",
    background: "black",
  })
  .log("Styled output");
```

---

## Complete example

### Global console

```js
import "styling-console";

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

### Local logger

```js
import logger from "styling-console/logger";

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

---

## Notes

- Styling is applied to string arguments.
- Non-string values are passed through to the underlying console method.
- Each log method can have its own default style.
- `style()` creates a separately styled logger and does not modify the existing logger configuration.
- `import "styling-console"` patches the global `console`.
- `import logger from "styling-console/logger"` does not modify the global `console`.
- Node.js output uses ANSI escape codes.
- Browser output uses `%c` and CSS in DevTools.
- The package is intended for console and developer-tool output, not HTML or DOM styling.
- The package has no runtime dependencies.
