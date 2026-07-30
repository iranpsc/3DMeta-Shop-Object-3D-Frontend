import { forwardRef } from "react";
import { FormFieldError } from "@/components/form/form-field-error";
import { formControlClass } from "@/components/form/form-control-classes";

type FormTextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "name"
> & {
  name: string;
  label?: string;
  error?: string | string[] | null;
  wrapperClassName?: string;
  labelClassName?: string;
  cols?: number;
  rows?: number;
};

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  function FormTextarea(
    {
      name,
      label = "",
      error,
      wrapperClassName = "",
      labelClassName = "",
      className,
      id,
      cols = 30,
      rows = 8,
      ...props
    },
    ref,
  ) {
    const inputId = id ?? name;
    const invalid = Boolean(error);

    return (
      <div className={`flex flex-col gap-5 ${wrapperClassName}`.trim()}>
        {label ? (
          <label htmlFor={inputId} className={labelClassName}>
            {label}
          </label>
        ) : null}
        <textarea
          ref={ref}
          name={name}
          id={inputId}
          cols={cols}
          rows={rows}
          className={formControlClass(invalid, className)}
          {...props}
        />
        <FormFieldError message={error} />
      </div>
    );
  },
);
