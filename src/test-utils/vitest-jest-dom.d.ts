// @testing-library/jest-dom 7.0.1 augments vitest's `Assertion` as a
// single-parameter interface (`Assertion<T = any>`) — the shape vitest 4 had.
// Vitest 5 widened it to `Assertion<R extends void | Promise<void>, T>`, and
// TypeScript merges a module augmentation only when the type-parameter list
// matches. So the matchers silently stopped attaching: every
// `expect(...).toBeInTheDocument()` became a TS2339 while passing at runtime.
//
// Re-declare the augmentation at vitest 5's arity. This lives under
// test-utils/ because vite-plugin-dts already excludes that directory, so it
// stays out of the published dist/.
//
// Remove this file when @testing-library/jest-dom ships vitest 5 types; the
// tell is that deleting it leaves `npm run type-check` green.
/* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare module 'vitest' {
  interface Assertion<
    R extends void | Promise<void> = void,
    T = unknown,
  > extends TestingLibraryMatchers<any, R> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<
    any,
    void
  > {}
}
