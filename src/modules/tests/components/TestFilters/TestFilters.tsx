import type { AttemptStatus } from '../../types/test-model.type';
import './test-filters.css';

type Props = {
  value: AttemptStatus | 'all';
  onChange: (value: AttemptStatus | 'all') => void;
};

const OPTIONS: Array<{ value: AttemptStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Բոլորը' },
  { value: 'passed', label: 'Անցած' },
  { value: 'failed', label: 'Ձախողված' },
  { value: 'not_taken', label: 'Չանցած' },
];

export function TestFilters({ value, onChange }: Props) {
  return (
    <div className="test-filters">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`test-filters__btn ${value === opt.value ? 'is-active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
