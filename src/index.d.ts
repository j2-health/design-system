type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never
declare module '*.svg' {
  import * as React from 'react'
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >

  // vite-plugin-svgr is configured in vite.config.ts and vitest.config.ts to
  // match every '*.svg' import and return the component as the default export.
  // This was previously typed as `string`, which forced callers to suppress a
  // type error at every use site.
  // eslint-disable-next-line no-restricted-exports
  export default ReactComponent
}
