import { cloneElement, isValidElement, useEffect, useId, useRef, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type ReactElement, type ReactNode, type RefObject, type TextareaHTMLAttributes } from 'react';

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
        <button type="button" className="ui-list-row-action" onClick={onActivate} disabled={disabled} aria-label={activateLabel}>{children}</button>
      ) : children}
    </li>
  );
}

type OverlayProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  closeLabel?: string;
  children: ReactNode;
  busy?: boolean;
  className?: string;
};

function useOverlayAccessibility(open: boolean, onClose: () => void, panelRef: RefObject<HTMLElement | null>) {
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return undefined;
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const panel = panelRef.current;
    const focusable = panel?.querySelector<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
    (focusable ?? panel)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;
      const elements = Array.from(panel.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (elements.length === 0) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      restoreFocusRef.current?.focus();
      restoreFocusRef.current = null;
    };
  }, [open, onClose, panelRef]);
}

export function Dialog({ open, title, description, onClose, closeLabel = 'Close', children, busy = false, className = '' }: OverlayProps) {
  const titleId = `ui-dialog-title-${useId().replace(/:/g, '')}`;
  const descriptionId = description ? `${titleId}-description` : undefined;
  const panelRef = useRef<HTMLElement>(null);
  useOverlayAccessibility(open, onClose, panelRef);
  if (!open) return null;
  return (
    <div className="ui-dialog-layer" role="presentation">
      <div className="ui-dialog-backdrop" aria-hidden="true" onClick={busy ? undefined : onClose} />
      <section ref={panelRef} tabIndex={-1} className={`ui-dialog${className ? ` ${className}` : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} aria-busy={busy || undefined}>
        <header className="ui-dialog-header">
          <div><h2 id={titleId}>{title}</h2>{description ? <p id={descriptionId}>{description}</p> : null}</div>
          <button type="button" className="ui-dialog-close" onClick={onClose} disabled={busy} aria-label={closeLabel}>×</button>
        </header>
        <div className="ui-dialog-content">{children}</div>
      </section>
    </div>
  );
}

export function Drawer({ open, title, description, onClose, closeLabel = 'Close', children, busy = false, className = '' }: OverlayProps) {
  const titleId = `ui-drawer-title-${useId().replace(/:/g, '')}`;
  const descriptionId = description ? `${titleId}-description` : undefined;
  const panelRef = useRef<HTMLElement>(null);
  useOverlayAccessibility(open, onClose, panelRef);
  if (!open) return null;
  return (
    <div className="ui-drawer-layer" role="presentation">
      <div className="ui-drawer-backdrop" aria-hidden="true" onClick={busy ? undefined : onClose} />
      <aside ref={panelRef} tabIndex={-1} className={`ui-drawer${className ? ` ${className}` : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} aria-busy={busy || undefined}>
        <header className="ui-drawer-header">
          <div><h2 id={titleId}>{title}</h2>{description ? <p id={descriptionId}>{description}</p> : null}</div>
          <button type="button" className="ui-drawer-close" onClick={onClose} disabled={busy} aria-label={closeLabel}>×</button>
        </header>
        <div className="ui-drawer-content">{children}</div>
      </aside>
    </div>
  );
}
