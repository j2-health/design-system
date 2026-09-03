type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never
declare module '*.svg?react' {
  import * as React from 'react'
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >

  // vite-plugin-svgr's ?react suffix returns the component as the default
  // export. This was previously typed as `string`, which forced callers to
  // suppress a type error at every use site.
  // eslint-disable-next-line import/no-default-export
  export default ReactComponent
}
