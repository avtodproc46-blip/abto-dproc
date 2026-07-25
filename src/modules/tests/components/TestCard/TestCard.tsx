import { Link } from 'react-router-dom';
import { Badge } from '../../../../shared/ui/Badge/Badge';
import type { TestListItemModel } from '../../types/test-model.type';
import './test-card.css';

type Props = {
  test: TestListItemModel;
};

export function TestCard({ test }: Props) {
  const tone =
    test.status === 'passed'
      ? 'pass'
      : test.status === 'failed'
        ? 'fail'
        : 'idle';

  return (
    <Link
      to={`/quiz/ticket/${test.id}`}
      className={`test-card test-card--${tone}`}
    >
      <div className="test-card__top">
        <span className="test-card__num">#{test.number}</span>
        {test.score && <Badge tone={tone}>{test.score}</Badge>}
      </div>
      <strong>{test.title || `Թեստ ${test.number}`}</strong>
      <span className="muted">{test.questionsCount} հարց</span>
    </Link>
  );
}
