export type FormElementType =
  | 'text'
  | 'number'
  | 'range'
  | 'checkbox'
  | 'radio'
  | 'password'
  | 'email';

export type ValidationRule = 'minLength' | 'maxLength' | '$equals';

export type FormSchemaItem = {
  type: FormElementType;
  placeholder?: string;
  rules: Record<
    ValidationRule,
    | number
    | string
    | Record<
        '$equals',
        string | number | boolean | Record<'$formValue', string>
      >
  >;
};

export type FormSchema = Record<string, FormSchemaItem>;

export type FormValue = string | number | boolean | undefined;
