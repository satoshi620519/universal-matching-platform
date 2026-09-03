import type { ReactNode } from 'react';

type NavigationItem = {
  href: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  disabled?: boolean;
};

type NavigationProps = {
  items: NavigationItem[];
  brand?: ReactNode;
  ariaLabel?: string;
  className?: string;
};

function NavigationLink({ item, className }: { item: NavigationItem; className: string }) {
  return (
    <a
      className={className}
      href={item.disabled ? undefined : item.href}
      aria-current={item.active ? 'page' : undefined}
      aria-disabled={item.disabled ? true : undefined}
      tabIndex={item.disabled ? -1 : undefined}
      onClick={item.disabled ? (event) => event.preventDefault() : undefined}
    >
      {item.icon ? <span className="ui-navigation-icon" aria-hidden="true">{item.icon}</span> : null}
      <span>{item.label}</span>
    </a>
  );
}

export function HeaderNavigation({ items, brand, ariaLabel = 'Primary navigation', className = '' }: NavigationProps) {
  return (
    <header className={`ui-header-navigation${className ? ` ${className}` : ''}`}>
      {brand ? <div className="ui-header-navigation-brand">{brand}</div> : null}
      <nav aria-label={ariaLabel}>
        <ul className="ui-header-navigation-list">
          {items.map((item) => (
            <li key={item.href}>
              <NavigationLink item={item} className="ui-header-navigation-link" />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export function BottomNavigation({ items, ariaLabel = 'Primary navigation', className = '' }: NavigationProps) {
  return (
    <nav className={`ui-bottom-navigation${className ? ` ${className}` : ''}`} aria-label={ariaLabel}>
      <ul className="ui-bottom-navigation-list">
        {items.map((item) => (
          <li key={item.href}>
            <NavigationLink item={item} className="ui-bottom-navigation-link" />
          </li>
        ))}
      </ul>
    </nav>
  );
}
