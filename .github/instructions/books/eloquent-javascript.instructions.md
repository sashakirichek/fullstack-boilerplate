---
name: eloquent-javascript
description:
  Distilled JavaScript and TypeScript engineering guidance from Eloquent JavaScript for maintainable code in this
  monorepo.
---

# Eloquent JavaScript

Status: distilled-from-online-edition.

Source note: distilled from the official online 4th edition at https://eloquentjavascript.net because that source is
cleaner and more reliable than OCR in this environment.

Use when refining JavaScript or TypeScript structure, data flow, module boundaries, async control flow, or testability
in this repo.

- Express the problem in domain vocabulary first. Extract helpers whose names match the concept instead of repeating
  low-level loops, conditionals, or formatting logic inline.
- Prefer functions that return values over helpers that immediately print, log, mutate shared state, or perform I/O.
  Keep route handlers, React components, and Worker entrypoints focused on orchestration.
- Choose the simplest data structure that preserves meaning: arrays for ordered collections, plain objects for fixed
  records, and `Map` or `Set` only when their semantics help.
- Be explicit about mutability and identity. When a transformation is easier to reason about as a new value, rebuild the
  data instead of mutating it in place.
- Use higher-order array methods such as `map`, `filter`, `reduce`, `find`, and `some` when they make a transformation
  pipeline easier to read. Use loops when they are clearer or avoid awkward intermediate state.
- Prefer ES modules with small, predictable interfaces. Avoid hidden dependencies through globals, ad hoc cross-module
  reach-through, or mixed concerns in one file.
- In async code, use `async` and `await` for linear flows, return promises from helpers, and avoid mutating shared
  bindings across `await` boundaries when you can derive a new result instead.
- Handle errors intentionally. Catch only the failures you expect to recover from, rethrow unknown errors, and use
  assertions or focused validation for programmer mistakes.
- Keep regular expressions narrow and explicit. Use anchors for full-input validation, prefer nongreedy operators when
  stripping or parsing, and use Unicode-aware patterns when text may leave ASCII.
- Add small automated tests for pure helpers, branchy transformations, and behavior that would otherwise fail late after
  passing through several functions.
- Use TypeScript types or runtime validation at package boundaries so input and output expectations are visible before
  bugs spread through the call chain.
