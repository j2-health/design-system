type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never
declare module '*.svg?react' {
  import * as React from 'react'
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >
  const src: string

  // eslint-disable-next-line import/no-default-export
  export default src
}
