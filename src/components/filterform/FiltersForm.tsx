import { FieldArray, Formik, useFormikContext } from 'formik'
import { Form } from '../form/Form'
import { Filter, FilterConfig, FilterField } from './FilterField'
import { Button } from '../button'
import React from 'react'
import { PlusCircle } from '@phosphor-icons/react'
import cx from 'classnames'

export type FilterForm = {
  filters: Filter[]
}

export const FiltersForm = ({
  filterConfigs,
}: {
  filterConfigs: FilterConfig[]
}) => {
  return (
    <Formik<FilterForm>
      initialValues={{
        filters: [
          {
            field: undefined,
            type: undefined,
            operator: undefined,
            values: undefined,
          },
        ],
      }}
      onSubmit={() => {}}
    >
      <Form>
        <FilterFormFields filterConfigs={filterConfigs} />
      </Form>
    </Formik>
  )
}

type FilterFormFieldsProps = {
  filterConfigs: FilterConfig[]
}

const FilterFormFields = ({ filterConfigs }: FilterFormFieldsProps) => {
  const { values } = useFormikContext<FilterForm>()

  const isInProgress = React.useMemo(() => {
    const lastFilter = values.filters[values.filters.length - 1]

    if (!lastFilter) return true

    return !(lastFilter.values && lastFilter.values.length > 0)
  }, [values.filters])

  return (
    <div>
      <FieldArray
        name="filters"
        render={(arrayHelpers) => (
          <div className={cx('flex flex-col gap-4')}>
            {values.filters.map((filter, index) => (
              <FilterField
                key={`filters-${index}`}
                filterConfigs={filterConfigs}
                filter={filter}
                index={index}
              />
            ))}
            {!isInProgress && (
              <div>
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
                >
                  Add Rule
                </Button>
              </div>
            )}
          </div>
        )}
      />
    </div>
  )
}
