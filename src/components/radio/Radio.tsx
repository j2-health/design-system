import {
  Radio as AntdRadio,
  RadioProps as AntdRadioProps,
  RadioGroupProps as AntdRadioGroupProps,
} from 'antd'

type RadioProps = Expand<AntdRadioProps>

type FullRadioGroupProps = AntdRadioGroupProps & {
  buttonStyle?: 'solid' | 'outline'
  optionType?: 'default' | 'button'
}
type RadioGroupProps = Expand<FullRadioGroupProps>

const Radio = (props: RadioProps) => {
  return <AntdRadio {...props} />
}

const RadioGroup = ({
  buttonStyle = 'solid',
  optionType = 'button',
  ...props
}: RadioGroupProps) => {
  return (
    <AntdRadio.Group
      {...props}
      buttonStyle={buttonStyle}
      optionType={optionType}
    />
  )
}

export { Radio, RadioGroup }
