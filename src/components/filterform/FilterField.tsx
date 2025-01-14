import * as React from 'react'
import { Select } from '../select'
import { useFilterField } from './useFilterField'
import { Input } from '../input'
import { InputNumber } from '../inputnumber'
import cx from 'classnames'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import { FilterConfig } from './types'

type FilterFieldProps = {
  filterConfigs: FilterConfig[]
  index: number
  className?: string
  size?: SizeType
}

export const FilterField = ({
  filterConfigs,
  index,
  className,
  size = 'middle',
}: FilterFieldProps) => {
  const {
    formKey,
    operatorOptions,
    valueInputConfig,
    handleFieldChange,
    handleOperatorChange,
  } = useFilterField({ filterConfigs, index })

  const fieldOptions = React.useMemo(() => {
    return filterConfigs.map((filter) => ({
      label: filter.label,
      value: filter.field,
    }))
  }, [filterConfigs])

  return (
    <div className={cx('grid grid-cols-3 gap-2', className)}>
      <Select
        options={fieldOptions}
        name={`${formKey}.field`}
        className="w-full"
        onChange={handleFieldChange}
        size={size}
      />
      <div className="col-span-2 flex gap-2">
        <Select
          options={operatorOptions}
          name={`${formKey}.operator`}
          onChange={handleOperatorChange}
          size={size}
          popupMatchSelectWidth={false}
        />
        {valueInputConfig?.type === 'select' && (
          <Select
            options={valueInputConfig.valueOptions}
            name={`${formKey}.values`}
            className="w-full"
            mode="multiple"
            allowClear
            size={size}
            optionFilterProp="label"
          />
        )}
        {valueInputConfig?.type === 'number' && (
          <div className={cx('flex gap-2', 'grow')}>
            {Array.from({ length: valueInputConfig.inputCount }).map(
              (_, index) => (
                <React.Fragment key={`${formKey}.values.${index}`}>
                  {index !== 0 && <span className="my-auto">and</span>}
                  <InputNumber
                    name={`${formKey}.values.${index}`}
                    size={size}
                    className="basis-1/2"
                  />
                </React.Fragment>
              )
            )}
          </div>
        )}
        {valueInputConfig?.type === 'text' && (
          <Input name={`${formKey}.values.0`} size={size} />
        )}
      </div>
    </div>
  )
}
