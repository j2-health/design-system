/* eslint-disable react-refresh/only-export-components */

export * from './tailwind.config.ts'

export * from './src/AppConfigProvider'
export * from './src/appTheme'
export * from './src/components/alert'
export * from './src/components/barchart'
export * from './src/components/breadcrumb'
export * from './src/components/bulkActionBar'
export * from './src/components/button'
export * from './src/components/card'
export * from './src/components/checkbox'
export * from './src/components/checkboxTree'
export * from './src/components/collapse'
export * from './src/components/drawer'
export * from './src/components/dropdown'
export * from './src/components/filterform'
export * from './src/components/form'
export * from './src/components/input'
export * from './src/components/inputnumber'
export * from './src/components/listpopover'
export * from './src/components/manageColumns'
export * from './src/components/menu'
export * from './src/components/message'
export * from './src/components/modal'
export * from './src/components/navMenu'
export * from './src/components/notification'
export * from './src/components/notificationModal'
export * from './src/components/pagination'
export * from './src/components/popover'
export * from './src/components/progress'
export * from './src/components/radio'
export * from './src/components/rate'
export * from './src/components/select'
export * from './src/components/skeleton'
export * from './src/components/spinner'
export * from './src/components/steps'
export * from './src/components/switch'
export * from './src/components/table'
export * from './src/components/tabs'
export * from './src/components/tag'
export * from './src/components/tooltip'
export * from './src/components/vennDiagram'
export * from './src/components/legacyNavMenu'

// Namespace the icon library directly rather than through a local module that
// does `export *` from it. Rolldown (Vite 8) compiles a namespace of such a
// module into a runtime copy of every export (`__reExport`), which no consumer
// can tree-shake, so `icons.X` pulled in the whole catalogue. A namespace of the
// external package itself stays a static import.
import * as icons from '@phosphor-icons/react'
export { icons }
