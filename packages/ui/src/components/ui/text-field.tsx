import type { TextFieldProps } from "react-aria-components"
import { TextField as TextFieldPrimitive } from "react-aria-components"
import { cx } from "../../lib/primitive"
import { fieldStyles } from "./field"


type ExtendedTextFieldProps = TextFieldProps & {
  errors?: any[]
}

const TextField = ({ className, errors, isInvalid, ...props }: ExtendedTextFieldProps) => {
  const invalid = isInvalid ?? (errors?.length ? errors.length > 0 : false)

  return (
    <TextFieldPrimitive
      data-slot="control"
      isInvalid={invalid}
      className={cx(fieldStyles(), className)}
      {...props}
    />
  )
}

export { TextField }
