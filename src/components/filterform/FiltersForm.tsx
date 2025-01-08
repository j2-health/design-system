import { FieldArray, Formik, useFormikContext } from 'formik'
import { Form } from '../form/Form'
import { FilterField } from './FilterField'
import { Button } from '../button'
import { PlusCircle, Trash } from '@phosphor-icons/react'
import s from './FiltersForm.module.css'
import cx from 'classnames'
import { FilterForm, FilterConfig } from '.'
import { validateFilterField } from './validateFilterField'

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
      validate={(values) => {
        return values.filters
          .map((filter) => validateFilterField(filter))
          .flat()
      }}
      onSubmit={onSubmit}
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
  const { values, isValid } = useFormikContext<FilterForm>()

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
                disabled={!isValid}
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
