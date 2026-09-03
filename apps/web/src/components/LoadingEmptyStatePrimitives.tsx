import type { ReactNode } from 'react';

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
  return (
    <section className={`ui-empty-state${className ? ` ${className}` : ''}`} aria-labelledby="ui-empty-state-title">
      <h2 id="ui-empty-state-title">{title}</h2>
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
  return (
    <section
      className={`ui-error-state${className ? ` ${className}` : ''}`}
      role="alert"
      aria-labelledby="ui-error-state-title"
    >
      <h2 id="ui-error-state-title">{title}</h2>
      {description ? <p>{description}</p> : null}
      {action ? <div className="ui-error-state-action">{action}</div> : null}
    </section>
  );
}
