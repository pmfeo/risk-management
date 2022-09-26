import React from "react";
import { useField } from "formik";
import { Form } from "react-bootstrap";

interface Props {
  name: string;
  [x: string]: any; // ...rest
}
export type Ref = HTMLInputElement;

const NumberInput = React.forwardRef<Ref, Props>((props, ref) => {
  const [field, meta] = useField(props);

  return (
    <>
      <Form.Control
        aria-describedby={field.name}
        type="number"
        step="any"
        isInvalid={Boolean(meta.error) && meta.touched}
        ref={ref}
        {...field}
        {...props}
      />
      {Boolean(meta.error) && meta.touched ? (
        <Form.Control.Feedback type="invalid">
          {meta.error}
        </Form.Control.Feedback>
      ) : null}
    </>
  );
});

NumberInput.displayName = "NumberInput";

export default NumberInput;
