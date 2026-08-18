// npm package entry. Mirrors ./index.ts (the git-submodule entry point).
//
// CSS is intentionally NOT imported here: component styles are extracted to
// dist/style.css by the library build, and the base stylesheet
// (src/stylesheets/index.css — design tokens, @tailwind directives, base
// element styles) ships raw so the consuming app's Tailwind/PostCSS pipeline
// processes it, exactly as submodule consumers do today.
export * from './index'
