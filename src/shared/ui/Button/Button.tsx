import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './button.css';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'warm';
};

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...rest
}: Props) {
  return (
    <button className={`ui-btn ui-btn--${variant} ${className}`} {...rest}>
      {children}
    </button>
  );
}
