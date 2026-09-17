import type { FieldProps } from 'formik'
import { createContext } from 'react'

// An item with its own validator owns the field registration. Its controls
// reuse that binding so mounting or unmounting them cannot replace the validator.
export const FormItemFieldContext = createContext<FieldProps | undefined>(
  undefined
)
