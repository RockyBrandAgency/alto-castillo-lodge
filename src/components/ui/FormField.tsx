import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import styles from "./FormField.module.css";

type BaseProps = {
  label: string;
  error?: string;
};

type InputFieldProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & { as?: "input" };

type TextareaFieldProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & { as: "textarea" };

type FormFieldProps = InputFieldProps | TextareaFieldProps;

/** 08 — Campos de formulario (Figma): label + control, estados foco/error/deshabilitado. */
export function FormField(props: FormFieldProps) {
  const { label, error, as = "input", id, ...rest } = props;
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div className={[styles.field, error ? styles.error : ""].filter(Boolean).join(" ")}>
      <label className={styles.label} htmlFor={fieldId}>
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          id={fieldId}
          className={styles.control}
          rows={4}
          aria-invalid={Boolean(error)}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={fieldId}
          className={styles.control}
          aria-invalid={Boolean(error)}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
