import { FieldArray, Formik, useFormikContext } from 'formik'
import { Form } from '../form/Form'
import { Filter, FilterConfig, FilterField } from './FilterField'
import { Button } from '../button'
import { PlusCircle, Trash } from '@phosphor-icons/react'
import './FiltersForm.css'
import cx from 'classnames'

export type FilterForm = {
  filters: Filter[]
}

type Props = {
  filterConfigs: FilterConfig[]
  title?: string
  onSubmit: (values: FilterForm) => void
}

export const FiltersForm = ({ filterConfigs, title, onSubmit }: Props) => {
  return (
    <Formik<FilterForm>
      initialValues={{
        filters: [
          {
            field: filterConfigs[0].field,
            type: filterConfigs[0].type,
            operator: undefined,
            values: undefined,
          },
        ],
      }}
      onSubmit={onSubmit}
    >
      <Form className="j2-filter-form">
        <div className="flex flex-col gap-4 filter-form-fields-container p-4 mb-6">
          {title && <span className="filter-form-title">{title}</span>}
          <FilterFormFields filterConfigs={filterConfigs} />
        </div>
        <div className="flex justify-end">
          <Button type="primary" htmlType="submit">
            Apply Filters
          </Button>
        </div>
      </Form>
    </Formik>
  )
}

type FilterFormFieldsProps = {
  filterConfigs: FilterConfig[]
}

const FilterFormFields = ({ filterConfigs }: FilterFormFieldsProps) => {
  const { values } = useFormikContext<FilterForm>()

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
                <Button
                  icon={<Trash />}
                  onClick={() => {
                    if (values.filters.length === 1) {
                      arrayHelpers.replace(index, {
                        field: filterConfigs[0].field,
                        type: filterConfigs[0].type,
                        operator: undefined,
                        values: undefined,
                      })
                    } else {
                      arrayHelpers.remove(index)
                    }
                  }}
                  type="text"
                />
              </div>
            ))}
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
          </div>
        )}
      />
    </div>
  )
}
