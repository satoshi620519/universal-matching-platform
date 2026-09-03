import { cloneElement, isValidElement, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type ReactElement, type ReactNode, type TextareaHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; loadingLabel?: string };

export function Button({ loading = false, loadingLabel = 'Loading…', children, disabled, ...props }: ButtonProps) {
  return <button type="button" aria-busy={loading || undefined} disabled={disabled || loading} {...props}>{loading ? loadingLabel : children}</button>;
}

type FieldProps = { label: string; id: string; description?: string; error?: string; required?: boolean; children: ReactNode };
type FieldControlProps = { id?: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean; 'aria-required'?: boolean };

export function Field({ label, id, description, error, required, children }: FieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  const controlProps: FieldControlProps = {
    id,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : undefined,
    'aria-required': required ? true : undefined,
  };
  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<FieldControlProps>, controlProps)
    : children;

  return (
    <div className="ui-field">
      <label className="ui-label" htmlFor={id}>{label}{required ? <span aria-hidden="true"> *</span> : null}</label>
      {description ? <p className="ui-description" id={descriptionId}>{description}</p> : null}
      {control}
      {error ? <p className="ui-error" id={errorId} role="alert">{error}</p> : null}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) { return <input {...props} />; }
export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea {...props} />; }

export function StatusMessage({ tone, children }: { tone: 'success' | 'warning' | 'error'; children: ReactNode }) {
  return <div className={`ui-status ui-status-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>{children}</div>;
}

export function Card({ className = '', children, ...props }: HTMLAttributes<HTMLElement>) {
  return <article className={`ui-card${className ? ` ${className}` : ''}`} {...props}>{children}</article>;
}

export function List({ className = '', children, ...props }: HTMLAttributes<HTMLUListElement>) {
  return <ul className={`ui-list${className ? ` ${className}` : ''}`} {...props}>{children}</ul>;
}

type ListRowProps = HTMLAttributes<HTMLLIElement> & {
  interactive?: boolean;
  onActivate?: () => void;
  activateLabel?: string;
  disabled?: boolean;
};

export function ListRow({ className = '', children, interactive = false, onActivate, activateLabel, disabled = false, ...props }: ListRowProps) {
  const isInteractive = interactive || Boolean(onActivate);
  return (
    <li className={`ui-list-row${className ? ` ${className}` : ''}`} {...props}>
      {isInteractive ? (
        <button
          type="button"
          className="ui-list-row-action"
          onClick={onActivate}
          disabled={disabled}
          aria-label={activateLabel}
        >
          {children}
        </button>
      ) : children}
    </li>
  );
}
