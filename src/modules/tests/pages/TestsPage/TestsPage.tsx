import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../../shared/ui/Button/Button';
import { loadStoredUser } from '../../../users/api/user-storage';
import { fetchTests } from '../../api/tests.api';
import { TestCard } from '../../components/TestCard/TestCard';
import { TestFilters } from '../../components/TestFilters/TestFilters';
import type {
  AttemptStatus,
  TestListItemModel,
} from '../../types/test-model.type';
import './tests-page.css';

export function TestsPage() {
  const [user] = useState(() => loadStoredUser());
  const [status, setStatus] = useState<AttemptStatus | 'all'>('all');
  const [items, setItems] = useState<TestListItemModel[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const take = 10;

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    setLoading(true);
    setError('');

    fetchTests({
      status,
      page,
      take,
    })
      .then((data) => {
        if (cancelled) return;
        setItems(data.items);
        setTotal(data.total);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Не удалось загрузить тесты');
        setItems([]);
        setTotal(0);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user, status, page]);

  if (!user) {
    return (
      <p className="muted">
        Сначала выбери пользователя на <Link to="/">главной</Link>
      </p>
    );
  }

  const pages = Math.max(1, Math.ceil(total / take));

  return (
    <section className="tests-page stack">
      <div className="tests-page__head row">
        <div>
          <h1>Թեստեր</h1>
          <p className="muted">
            Կանաչ՝ անցած · Կարմիր՝ ձախողված · Մոխրագույն՝ չանցած
          </p>
        </div>
        <Link to="/quiz/random">
          <Button variant="warm">Պատահական 20</Button>
        </Link>
      </div>

      <TestFilters
        value={status}
        onChange={(value) => {
          setPage(1);
          setStatus(value);
        }}
      />

      {loading ? (
        <p className="muted">Загрузка...</p>
      ) : (
        <div className="grid-tests">
          {items.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      )}

      {error && <p className="muted">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="muted">По этому фильтру тестов нет.</p>
      )}

      <div className="row tests-page__pager">
        <Button
          variant="ghost"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Назад
        </Button>
        <span className="muted">
          {page} / {pages}
        </span>
        <Button
          variant="ghost"
          disabled={page >= pages}
          onClick={() => setPage((p) => p + 1)}
        >
          Дальше
        </Button>
      </div>
    </section>
  );
}
