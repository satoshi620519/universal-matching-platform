import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingLabel?: string;
};

export function Button({ loading = false, loadingLabel = 'Loading…', children, disabled, ...props }: ButtonProps) {
  return (
    <button type="button" aria-busy={loading || undefined} disabled={disabled || loading} {...props}>
      {loading ? loadingLabel : children}
    </button>
  );
}

type FieldProps = {
  label: string;
  id: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
};

export function Field({ label, id, description, error, required, children }: FieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="ui-field">
      <label className="ui-label" htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {description ? <p className="ui-description" id={descriptionId}>{description}</p> : null}
      {cloneWithA11y(children, id, describedBy, Boolean(error), required)}
      {error ? <p className="ui-error" id={errorId} role="alert">{error}</p> : null}
    </div>
  );
}

function cloneWithA11y(child: ReactNode, id: string, describedBy: string | undefined, invalid: boolean, required?: boolean) {
  if (!isElement(child)) return child;
  return { ...child, props: { ...child.props, id, 'aria-describedby': describedBy, 'aria-invalid': invalid || undefined, 'aria-required': required || undefined } } as ReactNode;
}

function isElement(value: ReactNode): value is React.ReactElement {
  return typeof value === 'object' && value !== null && 'props' in value;
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} />;
}

export function StatusMessage({ tone, children }: { tone: 'success' | 'warning' | 'error'; children: ReactNode }) {
  return <div className={`ui-status ui-status-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>{children}</div>;
}
