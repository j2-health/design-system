import * as React from 'react'
import { FilterConfig } from '.'
import { useFilterField, ValueInputConfig } from './useFilterField'
import { Input, InputNumber, Select, Typography } from 'antd'
import { FormFilter } from './types'
import { normalizeMultiValues, tooManyValuesMessage } from './filterHelpers'
import cx from 'classnames'
import { SizeType } from 'antd/es/config-provider/SizeContext'

type FilterInputProps = {
  value?: FormFilter
  filterConfigs: FilterConfig[]
  onChange?: (value: FormFilter) => void
  onBlur?: (value: FormFilter) => void
  className?: string
  size?: SizeType
}

export const FilterInput = ({
  value,
  filterConfigs,
  onChange,
  onBlur,
  className,
  size = 'middle',
}: FilterInputProps) => {
  const {
    filter,
    operatorOptions,
    valueInputConfig,
    handleFieldChange,
    handleOperatorChange,
    handleValuesChange,
  } = useFilterField({
    filterConfigs,
    filter: value,
  })

  const fieldOptions = filterConfigs.map((config) => ({
    label: config.label,
    value: config.field,
    disabled: config.disabled,
  }))

  const handleBlur = () => {
    if (filter) {
      onBlur?.(filter)
    }
  }

  // Track if this is a user-driven change (not initialization)
  const isInitialMount = React.useRef(true)
  const prevFilterRef = React.useRef(filter)

  React.useEffect(() => {
    // Skip the initial mount to avoid calling onChange during initialization
    // — unless initialization itself corrected the persisted filter (an
    // operator the field no longer offers, or a chip list that needed
    // normalizing). Then the parent must learn about it, or it would keep
    // and submit the stale filter until the user happened to touch the rule.
    if (isInitialMount.current) {
      isInitialMount.current = false
      prevFilterRef.current = filter
      if (value && filter && wasCorrectedOnInit(value, filter)) {
        onChange?.(filter)
      }
      return
    }

    // Only call onChange if the filter actually changed
    if (filter && filter !== prevFilterRef.current) {
      prevFilterRef.current = filter
      onChange?.(filter)
    }
  }, [filter, onChange])

  return (
    <div className={cx('grid grid-cols-3 gap-2', className)}>
      <Select
        options={fieldOptions}
        value={filter?.field}
        showSearch
        optionFilterProp="label"
        onChange={handleFieldChange}
        size={size}
      />
      <div className="col-span-2 flex gap-2">
        <Select
          options={operatorOptions}
          value={filter?.operator}
          onChange={handleOperatorChange}
          onBlur={handleBlur}
          size={size}
          popupMatchSelectWidth={false}
        />
        {valueInputConfig && (
          <ValueInput
            valueInputConfig={valueInputConfig}
            values={filter?.values}
            onChange={handleValuesChange}
            onBlur={handleBlur}
            size={size}
          />
        )}
      </div>
    </div>
  )
}

const wasCorrectedOnInit = (persisted: FormFilter, current: FormFilter) =>
  persisted.operator !== current.operator ||
  persisted.values.length !== current.values.length ||
  persisted.values.some((v, i) => v !== current.values[i])

type ValueInputProps = {
  valueInputConfig: ValueInputConfig
  values?: (string | number | undefined | null)[]
  onChange: (value: (string | number | undefined | null)[]) => void
  onBlur: () => void
  size: SizeType
}

const ValueInput = ({
  valueInputConfig,
  values,
  onChange,
  onBlur,
  size,
}: ValueInputProps) => {
  const handleChange = (value: string | number | null) => {
    if (value === null) {
      onChange([])
    } else {
      onChange([value])
    }
  }

  const handleNumberChange = (value: string | number | null, index: number) => {
    const newValues: (string | number | undefined | null)[] = [
      ...(values ?? []),
    ]
    newValues[index] = value
    onChange(newValues)
  }

  switch (valueInputConfig.type) {
    case 'select':
      return (
        <Select
          options={valueInputConfig.valueOptions}
          onChange={onChange}
          showSearch
          allowClear
          mode="multiple"
          onBlur={onBlur}
          value={values}
          className="w-full truncate"
          size={size}
          optionFilterProp="label"
        />
      )
    case 'number':
      return (
        <div className="flex gap-2 grow">
          {Array.from({ length: valueInputConfig.inputCount }).map(
            (_, index) => (
              <React.Fragment key={`number-input-${index}`}>
                {index !== 0 && <span className="my-auto">and</span>}
                <InputNumber
                  onChange={(value) => handleNumberChange(value, index)}
                  onBlur={onBlur}
                  value={values?.[index]}
                  className="basis-1/2"
                  size={size}
                  {...(valueInputConfig.numberOptions ?? {})}
                />
              </React.Fragment>
            )
          )}
        </div>
      )
    case 'text':
      if (valueInputConfig.multiValue) {
        return (
          <MultiValueTextInput
            values={values}
            maxValues={valueInputConfig.maxValues}
            onChange={onChange}
            onBlur={onBlur}
            size={size}
          />
        )
      }
      return (
        <Input
          onBlur={onBlur}
          value={values?.[0] ?? undefined}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full"
          size={size}
        />
      )
    default:
      return null
  }
}

// Commas, newlines (both flavours) and tabs: a column pasted from Excel or a
// comma-separated list from an email both land as one chip per value.
export const MULTI_VALUE_TOKEN_SEPARATORS = [',', '\n', '\r', '\t']

/**
 * Chips input for the multi-value text operators (`isAnyOf` / `isNoneOf`).
 *
 * A tags Select rather than a text box split at query time: every token is
 * visible and individually removable before Apply, so a pasted value that
 * itself contains a comma (street addresses do) can be seen and fixed
 * instead of being silently shredded. The dropdown is kept closed — there
 * are no options to pick from; Enter or a separator commits a chip.
 */
const MultiValueTextInput = ({
  values,
  maxValues,
  onChange,
  onBlur,
  size,
}: {
  values?: (string | number | undefined | null)[]
  maxValues?: number
  onChange: (value: (string | number | undefined | null)[]) => void
  onBlur: () => void
  size: SizeType
}) => {
  // Rendered as stored: `useFilterField` normalizes values on the way into
  // state, so what the chips show is exactly what validation counts and
  // what `onSubmit` emits. (Numbers/nulls can't occur for a text filter;
  // the map is only for the shared `values` type.)
  const chips = (values ?? []).flatMap((value) =>
    value === null || value === undefined ? [] : [String(value)]
  )
  const over = maxValues !== undefined && chips.length > maxValues

  return (
    <div className="flex flex-col gap-1 w-full min-w-0">
      <Select
        mode="tags"
        tokenSeparators={MULTI_VALUE_TOKEN_SEPARATORS}
        value={chips}
        onChange={(next: string[]) => onChange(normalizeMultiValues(next))}
        onBlur={onBlur}
        open={false}
        suffixIcon={null}
        placeholder="Type or paste values, separated by commas"
        className="w-full"
        size={size}
        status={over ? 'error' : undefined}
        aria-label="Values"
      />
      {maxValues !== undefined && (
        <Typography.Text
          type={over ? 'danger' : 'secondary'}
          className="text-xs"
          role={over ? 'alert' : undefined}
        >
          {over
            ? `${tooManyValuesMessage(maxValues)} — remove ${
                chips.length - maxValues
              } to apply`
            : `${chips.length} / ${maxValues} values`}
        </Typography.Text>
      )}
    </div>
  )
}
