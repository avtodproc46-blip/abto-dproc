import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '../../../../shared/ui/Button/Button';
import { createUser, fetchUsers } from '../../api/users.api';
import { saveStoredUser } from '../../api/user-storage';
import type { UserModel } from '../../types/user-model.type';
import './user-gate.css';

type Props = {
  onReady: (user: UserModel) => void;
};

export function UserGate({ onReady }: Props) {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch(() => setError('Не удалось загрузить пользователей'))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const user = await createUser(name.trim());
    saveStoredUser(user);
    onReady(user);
  }

  function pickUser(user: UserModel) {
    saveStoredUser(user);
    onReady(user);
  }

  return (
    <section className="panel user-gate">
      <h1>Кто проходит тест?</h1>
      <p className="muted">
        Выбери пользователя — по нему будем показывать прогресс по билетам.
      </p>

      {loading && <p className="muted">Загрузка...</p>}
      {error && <p className="user-gate__error">{error}</p>}

      {!loading && users.length > 0 && (
        <div className="user-gate__list">
          {users.map((user) => (
            <button
              key={user.id}
              type="button"
              className="user-gate__chip"
              onClick={() => pickUser(user)}
            >
              {user.name}
            </button>
          ))}
        </div>
      )}

      <form className="user-gate__form" onSubmit={handleCreate}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Новое имя"
          minLength={2}
          required
        />
        <Button type="submit">Войти</Button>
      </form>
    </section>
  );
}
