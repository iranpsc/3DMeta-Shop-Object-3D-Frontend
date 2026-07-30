const errorStyle = { backgroundColor: "rgba(207, 117, 117, 0.47)" };

type FormFieldErrorProps = {
  message?: string | string[] | null;
  className?: string;
};

export function FormFieldError({ message, className = "" }: FormFieldErrorProps) {
  const text = Array.isArray(message) ? message[0] : message;

  if (!text) {
    return null;
  }

  return (
    <span
      className={`rounded-[10px] p-3.5 text-red-600 ${className}`.trim()}
      style={errorStyle}
    >
      {text}
    </span>
  );
}
