import { useId, type ReactNode } from 'react';

type LoadingStateProps = {
  label?: string;
  className?: string;
};

export function LoadingState({ label = 'Loading…', className = '' }: LoadingStateProps) {
  return (
    <div
      className={`ui-loading-state${className ? ` ${className}` : ''}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="ui-loading-indicator" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className = '' }: EmptyStateProps) {
  const titleId = `ui-empty-state-title-${useId().replace(/:/g, '')}`;
  return (
    <section className={`ui-empty-state${className ? ` ${className}` : ''}`} aria-labelledby={titleId}>
      <h2 id={titleId}>{title}</h2>
      {description ? <p>{description}</p> : null}
      {action ? <div className="ui-empty-state-action">{action}</div> : null}
    </section>
  );
}

type ErrorStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function ErrorState({ title, description, action, className = '' }: ErrorStateProps) {
  const titleId = `ui-error-state-title-${useId().replace(/:/g, '')}`;
  return (
    <section
      className={`ui-error-state${className ? ` ${className}` : ''}`}
      role="alert"
      aria-labelledby={titleId}
    >
      <h2 id={titleId}>{title}</h2>
      {description ? <p>{description}</p> : null}
      {action ? <div className="ui-error-state-action">{action}</div> : null}
    </section>
  );
}
