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

type DialogProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  closeLabel?: string;
  children: ReactNode;
  busy?: boolean;
  className?: string;
};

export function Dialog({ open, title, description, onClose, closeLabel = 'Close', children, busy = false, className = '' }: DialogProps) {
  if (!open) return null;
  const titleId = 'ui-dialog-title';
  const descriptionId = description ? 'ui-dialog-description' : undefined;
  return (
    <div className="ui-dialog-layer" role="presentation">
      <div className="ui-dialog-backdrop" aria-hidden="true" onClick={busy ? undefined : onClose} />
      <section
        className={`ui-dialog${className ? ` ${className}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-busy={busy || undefined}
      >
        <header className="ui-dialog-header">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description ? <p id={descriptionId}>{description}</p> : null}
          </div>
          <button type="button" className="ui-dialog-close" onClick={onClose} disabled={busy} aria-label={closeLabel}>×</button>
        </header>
        <div className="ui-dialog-content">{children}</div>
      </section>
    </div>
  );
}

type DrawerProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  closeLabel?: string;
  children: ReactNode;
  busy?: boolean;
  className?: string;
};

export function Drawer({ open, title, description, onClose, closeLabel = 'Close', children, busy = false, className = '' }: DrawerProps) {
  if (!open) return null;
  const titleId = 'ui-drawer-title';
  const descriptionId = description ? 'ui-drawer-description' : undefined;
  return (
    <div className="ui-drawer-layer" role="presentation">
      <div className="ui-drawer-backdrop" aria-hidden="true" onClick={busy ? undefined : onClose} />
      <aside
        className={`ui-drawer${className ? ` ${className}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-busy={busy || undefined}
      >
        <header className="ui-drawer-header">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description ? <p id={descriptionId}>{description}</p> : null}
          </div>
          <button type="button" className="ui-drawer-close" onClick={onClose} disabled={busy} aria-label={closeLabel}>×</button>
        </header>
        <div className="ui-drawer-content">{children}</div>
      </aside>
    </div>
  );
}
