import { forwardRef } from "react";
import { FormFieldError } from "@/components/form/form-field-error";
import { formControlClass } from "@/components/form/form-control-classes";

type FormTextInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name" | "type"
> & {
  name: string;
  label?: string;
  type?: React.HTMLInputTypeAttribute;
  error?: string | string[] | null;
  wrapperClassName?: string;
  labelClassName?: string;
};

export const FormTextInput = forwardRef<HTMLInputElement, FormTextInputProps>(
  function FormTextInput(
    {
      name,
      label = "",
      type = "text",
      error,
      wrapperClassName = "",
      labelClassName = "form-col-label col-sm-4",
      className,
      id,
      ...props
    },
    ref,
  ) {
    const inputId = id ?? name;
    const invalid = Boolean(error);

    return (
      <div className={`flex flex-col gap-3 ${wrapperClassName}`.trim()}>
        {label ? (
          <label htmlFor={inputId} className={labelClassName}>
            {label}
          </label>
        ) : null}
        <div className="flex flex-col gap-5">
          <input
            ref={ref}
            type={type}
            name={name}
            id={inputId}
            className={formControlClass(invalid, className)}
            {...props}
          />
          <FormFieldError message={error} />
        </div>
      </div>
    );
  },
);
