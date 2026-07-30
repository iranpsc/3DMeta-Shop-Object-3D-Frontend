import { forwardRef } from "react";
import { FormFieldError } from "@/components/form/form-field-error";

type FormFileInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name" | "type"
> & {
  name: string;
  label?: string;
  error?: string | string[] | null;
  wrapperClassName?: string;
  labelClassName?: string;
};

export const FormFileInput = forwardRef<HTMLInputElement, FormFileInputProps>(
  function FormFileInput(
    {
      name,
      label = "",
      error,
      wrapperClassName = "",
      labelClassName = "col-sm-4 col-form-label",
      className,
      id,
      ...props
    },
    ref,
  ) {
    const inputId = id ?? name;

    return (
      <div className={`flex flex-col gap-2 ${wrapperClassName}`.trim()}>
        {label ? (
          <label htmlFor={inputId} className={labelClassName}>
            {label}
          </label>
        ) : null}
        <div className="flex flex-col gap-5">
          <input
            ref={ref}
            type="file"
            name={name}
            id={inputId}
            className={[
              "form-control custom-file-input w-full rounded-[10px] border-2 border-dashed border-gray-500 bg-[#F8F9FA] p-3 dark:border-gray-800 dark:bg-black",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />
          <FormFieldError message={error} />
        </div>
      </div>
    );
  },
);
