export type InputType = 'text' | 'password' | 'number' | 'email' | 'tel' | 'url' | 'search'

export interface BaseFormProps {
  label?: string
  disabled?: boolean
  placeholder?: string
  autofocus?: boolean
  name?: string
}

export interface FormInputProps extends BaseFormProps {
  modelValue: any
}

export interface TextInputProps extends FormInputProps {
  type?: InputType
}

export interface NumberInputProps extends FormInputProps {
  min?: number
  max?: number
  step?: number
}

export interface RangeInputProps extends FormInputProps {
  min?: number
  max?: number
  step?: number
  showRanges?: boolean
}

export interface ToggleProps extends FormInputProps {
  placeholder?: never
  autofocus?: never
}

export interface SelectOption {
  label: string
  value: string | number
}

export interface SelectProps extends FormInputProps {
  options: SelectOption[] | string[]
}

export interface ColorInputProps extends FormInputProps {
  webgl?: boolean
  placeholder?: never
  autofocus?: never
}

export const DEFAULT_FORM_PROPS: Partial<BaseFormProps> = {
  disabled: false,
  autofocus: false
}
