import { FieldArray, Formik, useFormikContext } from 'formik'
import { Form } from '../form/Form'
import { Filter, FilterConfig, FilterField } from './FilterField'
import { Button } from '../button'
import { PlusCircle, Trash } from '@phosphor-icons/react'
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
            field: filterConfigs[0].field,
            type: filterConfigs[0].type,
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
