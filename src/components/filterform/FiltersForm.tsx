import { FieldArray, Formik, useFormikContext } from 'formik'
import { Form } from '../form/Form'
import { FilterField } from './FilterField'
import { Button } from '../button'
import { PlusCircle, Trash } from '@phosphor-icons/react'
import s from './FiltersForm.module.css'
import cx from 'classnames'
import { FilterForm, FilterConfig } from '.'
import {
  isEmptyFilter,
  isValidFilter,
  validateFilterField,
} from './filterHelpers'
import { debounce } from 'lodash'
import { useEffect } from 'react'

type Props = {
  filterConfigs: FilterConfig[]
  title?: string
  onSubmit: (values: FilterForm) => void
  initialValues?: FilterForm
}

export const FiltersForm = ({
  filterConfigs,
  title,
  onSubmit,
  initialValues,
}: Props) => {
  const handleSubmit = (values: FilterForm) => {
    const nonEmptyFilters = values.filters.filter(
      (filter) => !isEmptyFilter(filter)
    )
    onSubmit({ filters: nonEmptyFilters })
  }

  return (
    <Formik<FilterForm>
      initialValues={
        initialValues ?? {
          filters: [
            {
              field: filterConfigs[0].field,
              type: filterConfigs[0].type,
              operator: undefined,
              values: undefined,
            },
          ],
        }
      }
      onReset={(_, formikHelpers) => {
        formikHelpers.setFieldValue('filters', [
          {
            field: filterConfigs[0].field,
            type: filterConfigs[0].type,
            operator: undefined,
            values: undefined,
          },
        ])
      }}
      validateOnChange={false}
      validate={(values) => {
        if (values.filters.every((filter) => isEmptyFilter(filter))) {
          return
        }

        return values.filters
          .map((filter) => validateFilterField(filter))
          .flat()
      }}
      onSubmit={handleSubmit}
    >
      {({ isValid }) => (
        <Form className={s.j2FilterForm}>
          <div
            className={cx(
              s.filterFormFieldsContainer,
              'flex flex-col gap-4  p-4 mb-6'
            )}
          >
            {title && <span className={s.filterFormTitle}>{title}</span>}
            <FilterFormFields filterConfigs={filterConfigs} />
          </div>
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" disabled={!isValid}>
              Apply Filters
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

type FilterFormFieldsProps = {
  filterConfigs: FilterConfig[]
}

const FilterFormFields = ({ filterConfigs }: FilterFormFieldsProps) => {
  const { values, resetForm, validateForm } = useFormikContext<FilterForm>()

  const debouncedValidateForm = debounce(validateForm, 500)

  useEffect(() => {
    debouncedValidateForm()
  }, [values])

  return (
    <div>
      <FieldArray
        name="filters"
        render={(arrayHelpers) => (
          <div className={cx('flex flex-col gap-4')}>
            {values.filters.map((filter, index) => (
              <div
                key={`filter-field-${index}-${filter.field}-${filter.operator}`}
                className="flex items-center justify-between"
              >
                <FilterField
                  filterConfigs={filterConfigs}
                  index={index}
                  className="flex-1"
                />
                {index === 0 && values.filters.length === 1 ? (
                  <div className="w-8" />
                ) : (
                  <Button
                    icon={<Trash />}
                    onClick={() => arrayHelpers.remove(index)}
                    type="text"
                  />
                )}
              </div>
            ))}
            <div className="flex items-center">
              <Button
                icon={<PlusCircle />}
                onClick={() =>
                  arrayHelpers.push({
                    field: filterConfigs[0].field,
                    type: filterConfigs[0].type,
                    operator: undefined,
                    values: undefined,
                  })
                }
                disabled={
                  !values.filters.every((filter) => isValidFilter(filter))
                }
              >
                Add Rule
              </Button>
              {!values.filters.every((filter) => isEmptyFilter(filter)) && (
                <Button type="text" onClick={() => resetForm()}>
                  Clear All Rules
                </Button>
              )}
            </div>
          </div>
        )}
      />
    </div>
  )
}
