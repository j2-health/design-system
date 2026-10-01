// Internal to this package's own build: vite-plugin-svgr is configured in
// vite.config.ts and vitest.config.ts to match every '*.svg' import and return
// the component as the default export. Kept out of the published types
// (vite.config.ts excludes this file from dts) because an ambient '*.svg'
// module is global: shipped, it retypes every plain `.svg` import in a
// consuming app as a component, where Vite's default is a URL string.
declare module '*.svg' {
  import * as React from 'react'
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >

  // eslint-disable-next-line no-restricted-exports
  export default ReactComponent
}
