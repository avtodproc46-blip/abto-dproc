import './badge.css';

type Props = {
  children: string;
  tone?: 'pass' | 'fail' | 'idle';
};

export function Badge({ children, tone = 'idle' }: Props) {
  return <span className={`ui-badge ui-badge--${tone}`}>{children}</span>;
}
